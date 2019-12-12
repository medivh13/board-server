const { queryResult } = require('../services/executeDbQuery');
const { httpRequest } = require('../services/executeHttp');

const getAnswered = async (args) => {
    const query = 'SELECT COUNT(*) AS answered FROM ContactCallDetail WHERE contactDisposition = 2'; // HANDLED
    const res = await queryResult(args, query);
    return { answered: res[0].answered };
};

const getAbandoned = async (args) => {
    const query = 'SELECT COUNT(*) AS abandoned FROM ContactCallDetail WHERE contactDisposition != 2'; // ABANDONED
    const res = await queryResult(args, query);
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

const getAgentStates = async (args) => {
    const { http, logger } = args;
    http.options.method = 'GET';
    http.options.path = '/finesse/api/Users';
    const res = await httpRequest({ http: http.instance, logger }, http.options);
    const { User } = res.Users || { User: [] };

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

const getTotalCalls = async (args) => {
    const query = 'SELECT COUNT(*) AS totalcalls FROM ContactCallDetail';
    const res = await queryResult(args, query);
    return { totalCalls: res[0].totalcalls };
};

const getServiceLevelData = async (args) => {
    const { abandoned } = await getAbandoned(args);
    const { totalCalls } = await getTotalCalls(args);
    const { abandonRate } = getAbandonRate(abandoned, totalCalls);
    const { serviceLevel } = getServiceLevel(abandonRate);

    return {
        abandoned,
        totalCalls,
        abandonRate,
        serviceLevel
    }
};

const getAvgInbound = async (args) => {
    const query = 'SELECT AVG(connecttime) AS avginbound FROM ContactCallDetail WHERE contactType = 1'; // INCOMING / INBOUND
    const res = await queryResult(args, query);
    const secs = parseInt(res[0].avginbound || 0);
    const averageInboundArr = [
        ("0" + Math.round(secs / 3600)).slice(-2),
        ("0" + Math.round(secs / 60)).slice(-2),
        ("0" + (secs % 60)).slice(-2),
    ];
    const averageInbound = averageInboundArr.join(":");
    return { averageInbound };
};

const getAvgOutbound = async (args) => {
    const query = 'SELECT AVG(connecttime) AS avgoutbound FROM ContactCallDetail WHERE contactType = 2'; // OUTGOING / OUTBOUND
    const res = await queryResult(args, query);
    const secs = parseInt(res[0].avgoutbound || 0);
    const averageOutboundArr = [
        ("0" + Math.round(secs / 3600)).slice(-2),
        ("0" + Math.round(secs / 60)).slice(-2),
        ("0" + (secs % 60)).slice(-2),
    ];
    const averageOutbound = averageOutboundArr.join(":");
    return { averageOutbound };
};

const getCallQueue = async (args) => {
    const query = 'SELECT callswaiting FROM RtICDStatistics';
    const res = await queryResult(args, query);
    const callQueue = res[0] ? res[0].callswaiting || 0 : 0;
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

