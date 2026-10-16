import mysql from "mysql2/promise";

const globalForDb = global;
const pool = globalForDb.zentricPool || mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "zentric",
  waitForConnections: true,
  connectionLimit: 10,
});
if (process.env.NODE_ENV !== "production") globalForDb.zentricPool = pool;

async function rows(sql, values = []) {
  const [result] = await pool.execute(sql, values);
  return result;
}

const selectFields = (select, alias = "") => {
  const prefix = alias ? `\`${alias}\`.` : "`";
  if (!select) return `${alias ? `\`${alias}\`.` : ""}*`;
  return Object.keys(select).filter((key) => select[key] && key !== "_count" && key !== "tickets").map((key) => `${prefix}${key}\``).join(", ");
};

function userWhere(where = {}, alias = "") {
  const prefix = alias ? `\`${alias}\`.` : "`";
  const parts = [], values = [];
  for (const [key, value] of Object.entries(where)) {
    if (key === "OR") {
      const or = value.map((item) => {
        const [field, condition] = Object.entries(item)[0];
        values.push(`%${condition.contains}%`);
        return `${prefix}${field}\` LIKE ?`;
      });
      parts.push(`(${or.join(" OR ")})`);
    } else {
      parts.push(`${prefix}${key}\` = ?`);
      values.push(value);
    }
  }
  return { sql: parts.length ? ` WHERE ${parts.join(" AND ")}` : "", values };
}

function ticketWhere(where = {}, alias = "t") {
  const parts = [], values = [];
  for (const [key, value] of Object.entries(where)) {
    if (key === "OR") {
      const or = value.map((item) => {
        if (item.customer?.is?.OR) {
          const customerParts = item.customer.is.OR.map((condition) => {
            const [field, match] = Object.entries(condition)[0];
            values.push(`%${match.contains}%`);
            return `c.\`${field}\` LIKE ?`;
          });
          return `(${customerParts.join(" OR ")})`;
        }
        const [field, condition] = Object.entries(item)[0];
        values.push(`%${condition.contains}%`);
        return `\`${alias}\`.\`${field}\` LIKE ?`;
      });
      parts.push(`(${or.join(" OR ")})`);
    } else {
      parts.push(`\`${alias}\`.\`${key}\` = ?`);
      values.push(value);
    }
  }
  return { sql: parts.length ? ` WHERE ${parts.join(" AND ")}` : "", values };
}

async function attachTicket(ticket, include) {
  if (!ticket || !include) return ticket;
  if (include.customer) {
    const result = await rows(`SELECT ${selectFields(include.customer.select)} FROM \`user\` WHERE id = ?`, [ticket.customerId]);
    ticket.customer = result[0] || null;
  }
  if (include.assignedTo) {
    const result = ticket.assignedToId ? await rows(`SELECT ${selectFields(include.assignedTo.select)} FROM \`user\` WHERE id = ?`, [ticket.assignedToId]) : [];
    ticket.assignedTo = result[0] || null;
  }
  if (include.comments) {
    const commentInclude = include.comments.include;
    const comments = await rows("SELECT * FROM `ticketcomment` WHERE ticketId = ? ORDER BY createdAt ASC", [ticket.id]);
    if (commentInclude?.user) for (const comment of comments) {
      const result = await rows(`SELECT ${selectFields(commentInclude.user.select)} FROM \`user\` WHERE id = ?`, [comment.userId]);
      comment.user = result[0] || null;
    }
    ticket.comments = comments;
  }
  return ticket;
}

async function attachUser(user, select) {
  if (!user) return user;
  if (select?._count?.select?.tickets) user._count = { tickets: (await rows("SELECT COUNT(*) AS count FROM `ticket` WHERE customerId = ?", [user.id]))[0].count };
  if (select?.tickets) {
    const ticketRows = await rows("SELECT * FROM `ticket` WHERE customerId = ? ORDER BY createdAt DESC", [user.id]);
    for (const item of ticketRows) await attachTicket(item, select.tickets.include);
    user.tickets = ticketRows;
  }
  return user;
}

const user = {
  async findUnique({ where, select }) {
    const filter = userWhere(where), result = await rows(`SELECT ${selectFields(select)} FROM \`user\`${filter.sql} LIMIT 1`, filter.values);
    return attachUser(result[0] || null, select);
  },
  async findFirst({ where = {}, select }) {
    const filter = userWhere(where), result = await rows(`SELECT ${selectFields(select)} FROM \`user\`${filter.sql} LIMIT 1`, filter.values);
    return attachUser(result[0] || null, select);
  },
  async create({ data }) {
    const keys = Object.keys(data), result = await rows(`INSERT INTO \`user\` (${keys.map((key) => `\`${key}\``).join(", ")}, \`updatedAt\`) VALUES (${keys.map(() => "?").join(", ")}, NOW(3))`, Object.values(data));
    return (await rows("SELECT * FROM `user` WHERE id = ?", [result.insertId]))[0];
  },
  async update({ where, data, select }) {
    const keys = Object.keys(data), filter = userWhere(where);
    await rows(`UPDATE \`user\` SET ${[...keys.map((key) => `\`${key}\` = ?`), "`updatedAt` = NOW(3)"].join(", ")}${filter.sql}`, [...Object.values(data), ...filter.values]);
    return user.findUnique({ where, select });
  },
  async findMany({ where = {}, skip = 0, take = 10, orderBy, select } = {}) {
    const filter = userWhere(where), direction = orderBy?.createdAt === "asc" ? "ASC" : "DESC";
    const result = await rows(`SELECT ${selectFields(select)} FROM \`user\`${filter.sql} ORDER BY \`createdAt\` ${direction} LIMIT ? OFFSET ?`, [...filter.values, take, skip]);
    for (const item of result) await attachUser(item, select);
    return result;
  },
  async count({ where = {} } = {}) {
    const filter = userWhere(where);
    return (await rows(`SELECT COUNT(*) AS count FROM \`user\`${filter.sql}`, filter.values))[0].count;
  },
};

const ticket = {
  async findUnique({ where, include }) {
    const result = await rows("SELECT * FROM `ticket` WHERE id = ? LIMIT 1", [where.id]);
    return attachTicket(result[0] || null, include);
  },
  async findFirst({ orderBy, select }) {
    const result = await rows(`SELECT ${selectFields(select)} FROM \`ticket\` ORDER BY id ${orderBy?.id === "asc" ? "ASC" : "DESC"} LIMIT 1`);
    return result[0] || null;
  },
  async create({ data }) {
    const keys = Object.keys(data), result = await rows(`INSERT INTO \`ticket\` (${keys.map((key) => `\`${key}\``).join(", ")}, \`updatedAt\`) VALUES (${keys.map(() => "?").join(", ")}, NOW(3))`, Object.values(data));
    return (await rows("SELECT * FROM `ticket` WHERE id = ?", [result.insertId]))[0];
  },
  async update({ where, data, include }) {
    const keys = Object.keys(data);
    await rows(`UPDATE \`ticket\` SET ${[...keys.map((key) => `\`${key}\` = ?`), "`updatedAt` = NOW(3)"].join(", ")} WHERE id = ?`, [...Object.values(data), where.id]);
    return ticket.findUnique({ where, include });
  },
  async findMany({ where = {}, skip = 0, take = 10, orderBy, include } = {}) {
    const filter = ticketWhere(where), joins = where.OR?.some((item) => item.customer) ? " JOIN `user` c ON c.id = t.customerId" : "", direction = orderBy?.createdAt === "asc" ? "ASC" : "DESC";
    const result = await rows(`SELECT t.* FROM \`ticket\` t${joins}${filter.sql} ORDER BY t.\`createdAt\` ${direction} LIMIT ? OFFSET ?`, [...filter.values, take, skip]);
    for (const item of result) await attachTicket(item, include);
    return result;
  },
  async count({ where = {} } = {}) {
    const filter = ticketWhere(where), joins = where.OR?.some((item) => item.customer) ? " JOIN `user` c ON c.id = t.customerId" : "";
    return (await rows(`SELECT COUNT(*) AS count FROM \`ticket\` t${joins}${filter.sql}`, filter.values))[0].count;
  },
  async groupBy() {
    return (await rows("SELECT status, COUNT(*) AS count FROM `ticket` GROUP BY status")).map((item) => ({ status: item.status, _count: { _all: item.count } }));
  },
};

const ticketComment = {
  async create({ data }) {
    const keys = Object.keys(data), result = await rows(`INSERT INTO \`ticketcomment\` (${keys.map((key) => `\`${key}\``).join(", ")}, \`updatedAt\`) VALUES (${keys.map(() => "?").join(", ")}, NOW(3))`, Object.values(data));
    return (await rows("SELECT * FROM `ticketcomment` WHERE id = ?", [result.insertId]))[0];
  },
};

export const prisma = { user, ticket, ticketComment, $transaction: async (operations) => Promise.all(operations) };
