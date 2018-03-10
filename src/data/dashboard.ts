import { getDb } from '../db/utils';
import { sql } from '../sql-string';

export async function getEmployeeSalesLeaderboard() {
  let db = await getDb();
  return await db.all(sql`SELECT (e.firstname || ' ' || e.lastname) as name, sum((od.unitprice * od.quantity))as amount FROM
  Employee as e INNER JOIN CustomerOrder as o
  ON o.employeeid = e.id
  INNER JOIN OrderDetail as od
  ON o.id = od.orderid
  GROUP BY e.id
  ORDER BY amount desc
  LIMIT 5
`);
}

export async function getCustomerSalesLeaderboard() {
  let db = await getDb();
  return await db.all(sql`SELECT c.companyname as name, sum((od.unitprice * od.quantity))as amount FROM
  Customer as c INNER JOIN CustomerOrder as o
  ON o.customerid = c.id
  INNER JOIN OrderDetail as od
  ON o.id = od.orderid
  GROUP BY c.id
  ORDER BY amount desc
  LIMIT 5
`);
}

export async function getProductSalesLeaderboard() {
  let db = await getDb();
  return await db.all(sql`SELECT p.productname as name, sum(od.unitprice * od.quantity) as amount
FROM
  OrderDetail AS od
  INNER JOIN CustomerOrder AS o ON od.orderid = o.id
  INNER JOIN Product AS p ON od.productid = p.id
GROUP BY p.id
ORDER BY amount DESC
LIMIT 5`);
}

export async function getRecentOrders() {
  let db = await getDb();
  return await db.all(sql`
  SELECT o.id, (e.firstname || ' ' || e.lastname) as employee, c.companyname as customer, o.orderdate, sum(od.unitprice * od.quantity) as subtotal FROM
  CustomerOrder as o
  INNER JOIN OrderDetail AS od ON od.orderid = o.id
  INNER JOIN Employee AS e on o.employeeid = e.id
  INNER JOIN Customer AS c on o.customerid = c.id
  WHERE o.orderdate IS NOT NULL
  GROUP BY o.id, e.firstname, e.lastname, c.companyname
  ORDER BY o.orderdate DESC
  LIMIT 5`);
}

export async function getReorderList() {
  let db = await getDb();
  return await db.all(
    sql`SELECT productname as name, reorderlevel, unitsinstock, unitsonorder from Product WHERE (unitsinstock + unitsonorder) < reorderlevel`
  );
}
