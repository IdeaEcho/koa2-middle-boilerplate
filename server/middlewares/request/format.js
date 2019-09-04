/**
 * 格式化response数据为object
 **/
module.exports = {
    strToObj: function (response) {
        let o = response;
        let data = o.statusCode == 200 ? JSON.parse(o.body) : o.body;
        return data;
    }
};
