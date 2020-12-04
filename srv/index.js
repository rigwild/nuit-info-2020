'use strict';

var path = require('path');
var cors = require('cors');
var express = require('express');
var postgres = require('postgres');
var debug = require('debug');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var cors__default = /*#__PURE__*/_interopDefaultLegacy(cors);
var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var postgres__default = /*#__PURE__*/_interopDefaultLegacy(postgres);
var debug__default = /*#__PURE__*/_interopDefaultLegacy(debug);

let missingFields; function $required(name, value) {
    if (typeof value === 'undefined')
        missingFields.push(name);
    return value;
} function $wrapper(fn, decoder) {
    return async function expressBuilderMiddleware(req, res, next) {
        var _a;
        try {
            missingFields = [];
            const args = decoder((req.method === 'GET' || req.method === 'HEAD') ? {} : req.body, req.query, req.params);
            if (missingFields.length)
                throw {
                    code: 400,
                    type: 'MISSING_FIELDS_ERROR',
                    message: `${missingFields.length} ${missingFields.length ? 'field is' : 'fields are'} missing: ${missingFields.join(', ')}`,
                    fields: missingFields
                };
            try {
                let data = typeof fn === 'function' ? fn.apply(req.session || (req.session = {}), args) : fn;
                if (!(data instanceof Promise))
                    data = Promise.resolve(data);
                data = await data;
                if (data === undefined || req.method === 'HEAD')
                    res.status(204).end();
                else
                    res.status(200).json({ data });
            }
            catch (err) {
                if (err instanceof TypeError
                    || err instanceof SyntaxError
                    || err instanceof EvalError)
                    throw err;
                if (typeof err !== 'object' || !err)
                    err = { type: 'INVALID_INTERNAL_ERROR', unexpected: err };
                else if (err instanceof Error)
                    err = { ...err, status: err.status, code: err.code || ((_a = Object.getPrototypeOf(err)) === null || _a === void 0 ? void 0 : _a.name), message: err.message };
                throw err;
            }
        }
        catch (err) {
            if (err instanceof Error)
                next(err);
            else {
                const { status = 500, code = 'UNKNOWN_ERROR', message = 'Internal server error', ...data } = err || {};
                res.status(status).json({ error: { code, message, ...data } });
            }
        }
    };
}

const log = debug__default['default']('postgres:query');
const sql = postgres__default['default']({
    database: 'surfor',
    debug: (_, q) => log('query: %s', q)
});

async function activities() {
    return sql `SELECT * FROM activity;`;
}

const $router = express.Router({ caseSensitive: true });

$router.all("/activities", $wrapper(activities, () => []));

async function products() {
    const [{ products: reportables }, { products: consumables }] = await sql `SELECT array_agg(json_build_object('id',product_id,'name',name)) AS products FROM product GROUP BY is_consumable ORDER BY is_consumable ASC;`;
    return ({
        consumables,
        reportables
    });
}

const $router$1 = express.Router({ caseSensitive: true });

$router$1.all("/products", $wrapper(products, () => []));

async function report({ activityId: activity_id, deviceId: device_uuid, position, products, activityStartedAt: activity_started_at, activityEndedAt: activity_ended_at }) {
    await sql.begin(async (sql) => {
        const [{ report_id } = { report_id: null }] = await sql `INSERT INTO report ${sql({
            activity_id,
            device_uuid,
            position: [position],
            activity_started_at,
            activity_ended_at
        })} RETURNING report_id`;
        await sql `INSERT INTO report_product ${sql(products.map((productId) => ({
            product_id: productId,
            report_id
        })))}`;
    });
}
async function statistics() {
    const [[report], products] = await sql.begin(sql => [
        sql `SELECT
      COUNT(report_id)::integer AS reports_count,
      COUNT(DISTINCT device_uuid)::integer AS users_count,
      EXTRACT(epoch FROM AVG(activity_ended_at - activity_started_at)) * 1000 AS report_avg_duration
    FROM report`,
        sql `
    SELECT
      RP.product_id AS id,
      P.name,
      P.is_consumable,
      COUNT(*)::integer AS count
    FROM report_product RP
    INNER JOIN product P ON P.product_id = RP.product_id
    GROUP BY RP.product_id, P.name, P.is_consumable
    ORDER BY count DESC`
    ]);
    return { ...report, products };
}

const $router$2 = express.Router({ caseSensitive: true });

$router$2.all("/report", $wrapper(report, obj => [$required("$0", obj)]));

$router$2.all("/statistics", $wrapper(statistics, () => []));

const app = express__default['default']();
const dist = path.resolve(__dirname, '../../dist'); // Resolved from server/dist/index.js
app.use(express__default['default'].static(dist));
const apiErrorHandler = (error, req, res, next) => res.status(500).json({
    error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An internal server occured: ' + (error && (error.message || error)),
        error
    }
});
const notFoundHandler = (req, res) => res.status(404).json({
    error: {
        code: 'NOT_FOUND',
        message: 'Route not found: ' + req.path,
        route: req.path
    }
});
app.use('/api', cors__default['default']({ origin: 'http://localhost:3000', credentials: true }), express__default['default'].json(), $router$1, $router, $router$2, apiErrorHandler, notFoundHandler);
app.use((_, res) => res.sendFile('index.html', { root: dist }));
const PORT = +(process.env.PORT || 4000);
app.listen(PORT, () => console.info('Server ready. http://localhost:%d/', PORT));
//# sourceMappingURL=index.js.map
