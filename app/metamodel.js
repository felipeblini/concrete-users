//Hivepod Metamodel
var meta = require('./meta');

var metamodel = new meta.Metamodel({
	classes : [
		new meta.Class({
			name: 'User',
			attributes: [
				new meta.Attribute({ name: 'userId', type: 'int', required: true }),
				new meta.Attribute({ name: 'nome', type: 'string', required: true }),
				new meta.Attribute({ name: 'email', type: 'string', required: true }),
				new meta.Attribute({ name: 'senha', type: 'string', required: true }),
				new meta.Attribute({ name: 'data_criacao', type: 'date', required: true }),
				new meta.Attribute({ name: 'data_atualizacao', type: 'date' }),
				new meta.Attribute({ name: 'ultimo_login', type: 'date' })	
			],
			operations: [
				new meta.Operation({ name: 'query',  isQuery: true }),
				new meta.Operation({ name: 'create', isCreation: true }),
				new meta.Operation({ name: 'update', isUpdate: true }),
				new meta.Operation({ name: 'delete', isDeletion: true })
			]			
		}),
		new meta.Class({
			name: 'Telefone',
			attributes: [
				new meta.Attribute({ name: 'ddd', type: 'int', required: true }),
				new meta.Attribute({ name: 'numero', type: 'int', required: true })	
			],
			operations: [
				new meta.Operation({ name: 'query',  isQuery: true }),
				new meta.Operation({ name: 'create', isCreation: true }),
				new meta.Operation({ name: 'update', isUpdate: true }),
				new meta.Operation({ name: 'delete', isDeletion: true })
			]			
		})	
	],
	associations : [
		new meta.Association({
			name: 'UserTelefones',
			composition: false,
			aClass: 'user',
			aRole: 'telefones',
			aMinCardinality: 0,
			aMaxCardinality: Number.MAX_VALUE,
			bClass: 'telefone',
			bRole: 'user',
			bMinCardinality: 0,
			bMaxCardinality: 1
		})	
	]
});
		
module.exports = metamodel;
