var mongoose = require('mongoose');
var async = require('async');

var userIds = [];
var userList = [
	{
		userId: 0,
		nome: 'nome1',
		email: 'email2',
		senha: 'senha3',
		data_criacao: '2014.03.31',
		data_atualizacao: '2014.03.31',
		ultimo_login: '2014.03.31'	
	},
	{
		userId: 70,
		nome: 'nome8',
		email: 'email9',
		senha: 'senha10',
		data_criacao: '2014.03.31',
		data_atualizacao: '2014.03.31',
		ultimo_login: '2014.03.31'	
	},
	{
		userId: 140,
		nome: 'nome15',
		email: 'email16',
		senha: 'senha17',
		data_criacao: '2014.03.31',
		data_atualizacao: '2014.03.31',
		ultimo_login: '2014.03.31'	
	},
];
function createUserTestData(done) {
    var userModel = mongoose.model('user');

	var userModels = userList.map(function (user) {
        return new userModel(user);
    });

    var deferred = [
        userModel.remove.bind(userModel)
    ];

    deferred = deferred.concat(userModels.map(function (user) {
        return user.save.bind(user);
    }));

    async.series(deferred, done);
}
function setUserIds(done) {
    mongoose.model('user').find().exec(function (err, results) {
        if (err) {
            return done(err);
        }

        userIds = [];
        results.forEach(function(user){
            userIds.push(user._id);
        });

        return done();
    });
}
function getUserIds() {
    return userIds;
}

var telefoneIds = [];
var telefoneList = [
	{
		ddd: 210,
		numero: 220	
	},
	{
		ddd: 230,
		numero: 240	
	},
	{
		ddd: 250,
		numero: 260	
	},
];
function createTelefoneTestData(done) {
    var telefoneModel = mongoose.model('telefone');

	var telefoneModels = telefoneList.map(function (telefone) {
        return new telefoneModel(telefone);
    });

    var deferred = [
        telefoneModel.remove.bind(telefoneModel)
    ];

    deferred = deferred.concat(telefoneModels.map(function (telefone) {
        return telefone.save.bind(telefone);
    }));

    async.series(deferred, done);
}
function setTelefoneIds(done) {
    mongoose.model('telefone').find().exec(function (err, results) {
        if (err) {
            return done(err);
        }

        telefoneIds = [];
        results.forEach(function(telefone){
            telefoneIds.push(telefone._id);
        });

        return done();
    });
}
function getTelefoneIds() {
    return telefoneIds;
}

module.exports = {
    createUserTestData: createUserTestData,
    setUserIds: setUserIds,
	getUserIds: getUserIds,
    createTelefoneTestData: createTelefoneTestData,
    setTelefoneIds: setTelefoneIds,
	getTelefoneIds: getTelefoneIds,
};
