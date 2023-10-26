const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");

let dao = daoApi.create({
	table: "CODBEX_COUNTRY",
	properties: [
		{
			name: "Id",
			column: "COUNTRY_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "Name",
			column: "COUNTRY_NAME",
			type: "VARCHAR",
			required: true
		},
 {
			name: "Code2",
			column: "COUNTRY_CODE2",
			type: "CHAR",
			required: true
		},
 {
			name: "Code3",
			column: "COUNTRY_CODE3",
			type: "CHAR",
			required: true
		},
 {
			name: "Numeric",
			column: "COUNTRY_NUMERIC",
			type: "CHAR",
			required: true
		}
]
});

exports.list = function(settings) {
	return dao.list(settings);
};

exports.get = function(id) {
	return dao.find(id);
};

exports.create = function(entity) {
	let id = dao.insert(entity);
	triggerEvent("Create", {
		table: "CODBEX_COUNTRY",
		key: {
			name: "Id",
			column: "COUNTRY_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_COUNTRY",
		key: {
			name: "Id",
			column: "COUNTRY_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_COUNTRY",
		key: {
			name: "Id",
			column: "COUNTRY_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_COUNTRY"');
	if (resultSet !== null && resultSet[0] !== null) {
		if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
			return resultSet[0].COUNT;
		} else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
			return resultSet[0].count;
		}
	}
	return 0;
};

function triggerEvent(operation, data) {
	producer.queue("codbex-countries/Countries/Country/" + operation).send(JSON.stringify(data));
}