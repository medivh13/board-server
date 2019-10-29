const { queryResult } = require('../services/executeDbQuery');
const { httpRequest } = require('../services/executeHttp');

const getAnswered = async ({ odbc }) => {
    const query = 'SELECT COUNT(*) AS answered FROM ContactCallDetail WHERE contactDisposition = 2'; // HANDLED
    const res = await queryResult(odbc, query);
    return { answered: res[0].answered };
};

const getAbandoned = async ({ odbc }) => {
    const query = 'SELECT COUNT(*) AS abandoned FROM ContactCallDetail WHERE contactDisposition != 2'; // ABANDONED
    const res = await queryResult(odbc, query);
    return { abandoned: res[0].abandoned };
};

const getTalking = (User) => {
    return User.filter(u => u.state === 'TALKING').length;
};

const getReady = (User) => {
    return User.filter(u => u.state === 'READY').length;
};

const getNotReady = (User) => {
    return User.filter(u => (u.state !== 'TALKING' && u.state !== 'READY')).length;
};

const getAgentStates = async ({ http }) => {
    http.options.method = 'GET';
    http.options.path = '/finesse/api/Users';
    const res = await httpRequest(http.instance, http.options);
    const { Users: { User }} = res;

    return {
        talking: getTalking(User),
        ready: getReady(User),
        notReady: getNotReady(User)
    };
};

const getAbandonRate = (abandoned, totalCalls) => {
    let sumCalls = totalCalls === 0 ? 1 : totalCalls;
    const abandonRate = ((abandoned / sumCalls) * 100).toFixed(2);

    return { abandonRate };
};

const getServiceLevel = (abandonRate) => {
    const serviceLevel = (100 - abandonRate).toFixed(2);
    return { serviceLevel };
};

const getTotalCalls = async ({ odbc }) => {
    const query = 'SELECT COUNT(*) AS totalcalls FROM ContactCallDetail';
    const res = await queryResult(odbc, query);
    return { totalCalls: res[0].totalcalls };
};

const getServiceLevelData = async ({ odbc }) => {
    const { abandoned } = await getAbandoned({ odbc });
    const { totalCalls } = await getTotalCalls({ odbc });
    const { abandonRate } = getAbandonRate(abandoned, totalCalls);
    const { serviceLevel } = getServiceLevel(abandonRate);

    return {
        abandoned,
        totalCalls,
        abandonRate,
        serviceLevel
    }
};

const getAvgInbound = async ({ odbc }) => {
    const query = 'SELECT AVG(connecttime) AS avginbound FROM ContactCallDetail WHERE contactType = 1'; // INCOMING / INBOUND
    const res = await queryResult(odbc, query);
    const secs = parseInt(res[0].avginbound);
    const averageInboundArr = [
        ("0" + Math.round(secs / 3600)).slice(-2),
        ("0" + Math.round(secs / 60)).slice(-2),
        ("0" + (secs % 60)).slice(-2),
    ];
    const averageInbound = averageInboundArr.join(":");
    return { averageInbound };
};

const getAvgOutbound = async ({ odbc }) => {
    const query = 'SELECT AVG(connecttime) AS avgoutbound FROM ContactCallDetail WHERE contactType = 2'; // OUTGOING / OUTBOUND
    const res = await queryResult(odbc, query);
    const secs = parseInt(res[0].avgoutbound);
    const averageOutboundArr = [
        ("0" + Math.round(secs / 3600)).slice(-2),
        ("0" + Math.round(secs / 60)).slice(-2),
        ("0" + (secs % 60)).slice(-2),
    ];
    const averageOutbound = averageOutboundArr.join(":");
    return { averageOutbound };
};

const getCallQueue = async ({ odbc }) => {
    const query = 'SELECT callswaiting FROM RtICDStatistics';
    const res = await queryResult(odbc, query);
    const callQueue = res[0].callswaiting;
    return { callQueue };
};

module.exports = [
    getAnswered,
    getAgentStates,
    getServiceLevelData,
    getAvgInbound,
    getAvgOutbound,
    getCallQueue
];

