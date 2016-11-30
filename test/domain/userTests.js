var fixtures = require('./fixtures');

describe('User relationships', function () {
    before(fixtures.fakeserver.init);
    after(fixtures.fakeserver.deinit);
    beforeEach(fixtures.testData.createUserTestData);
    beforeEach(fixtures.testData.setUserIds);
    beforeEach(fixtures.testData.createTelefoneTestData);
    beforeEach(fixtures.testData.setTelefoneIds);

	describe('Telefones', function () {
        it('"GET /users/{id}/telefones" should return empty list', function (done) {

            var userId = fixtures.testData.getUserIds()[0];

            var options = {
                url: 'http://127.0.0.1:8012/api/users/' + userId + '/telefones',
                json: true
            };

            request.get(options, function (err, response, body) {
                if (err) {
                    return done(err);
                }
                expect(response.statusCode).to.be(200);
                expect(body).to.be.an(Array);
                expect(body.length).to.be(0);
                done();
            });
        });
        it('"PUT /users/{id}/telefones" should set linked Telefones', function (done) {

            var userId = fixtures.testData.getUserIds()[0];
            var firstTelefoneId = fixtures.testData.getTelefoneIds()[0];
            var secondTelefoneId = fixtures.testData.getTelefoneIds()[1];
            
            var options = {
                url: 'http://127.0.0.1:8012/api/users/' + userId + '/telefones',
                json: true,
                body: [firstTelefoneId]
            };

            request.post(options, function (err, response, body) {
                if (err) {
                    return done(err);
                }
                
                var options = {
                    url: 'http://127.0.0.1:8012/api/users/' + userId + '/telefones',
                    json: true,
                    body: [secondTelefoneId]
                };
    
                request.put(options, function (err, response, body) {
                    if (err) {
                        return done(err);
                    }
                    
                    expect(response.statusCode).to.be(200);
                    expect(body._id.toString()).to.be(userId.toString());
    
                    var options = {
                        url: 'http://127.0.0.1:8012/api/users/' + userId + '/telefones',
                        json: true
                    };
    
                    request.get(options, function (err, response, body) {
                        if (err) {
                            return done(err);
                        }
    
                        expect(response.statusCode).to.be(200);
                        expect(body).to.be.an(Array);
                        expect(body.length).to.be(1);
                        expect(body[0]._id.toString()).to.be(secondTelefoneId.toString());
						expect(body[0].user.toString()).to.be(userId.toString());
                        done();
                    });
                });
            });
        });
        it('"POST /users/{id}/telefones" should add link(s) to one or more Telefones', function (done) {

            var userId = fixtures.testData.getUserIds()[0];
            var telefoneIds = [fixtures.testData.getTelefoneIds()[0]];

            var options = {
                url: 'http://127.0.0.1:8012/api/users/' + userId + '/telefones',
                json: true,
                body: telefoneIds
            };

            request.post(options, function (err, response, body) {
                if (err) {
                    return done(err);
                }

                expect(response.statusCode).to.be(200);
                expect(body._id.toString()).to.be(userId.toString());

                var options = {
                    url: 'http://127.0.0.1:8012/api/users/' + userId + '/telefones',
                    json: true
                };

                request.get(options, function (err, response, body) {
                    if (err) {
                        return done(err);
                    }

                    expect(response.statusCode).to.be(200);
                    expect(body).to.be.an(Array);
                    expect(body.length).to.be(1);
                    expect(body[0]._id.toString()).to.be(telefoneIds[0].toString());
                    expect(body[0].user.toString()).to.be(userId.toString());
                    done();
                });
            });
        });
        it('"DELETE /users/{id}/telefones/{telefoneId}" should remove a link from user to Telefone', function (done) {

            var userId = fixtures.testData.getUserIds()[0];
            var telefoneId = fixtures.testData.getTelefoneIds()[0];

            //First link them
            var options = {
                url: 'http://127.0.0.1:8012/api/users/' + userId + '/telefones',
                json: true,
                body: [telefoneId, fixtures.testData.getTelefoneIds()[1]]
            };

            request.post(options, function (err, response, body) {
                if (err) {
                    return done(err);
                }

                options = {
                    url: 'http://127.0.0.1:8012/api/users/' + userId + '/telefones/' + telefoneId,
                    json: true
                };

                request.del(options, function (err, response, body) {
                    if (err) {
                        return done(err);
                    }

                    expect(response.statusCode).to.be(200);
                    expect(body._id.toString()).to.be(userId.toString());

                    var options = {
                        url: 'http://127.0.0.1:8012/api/users/' + userId + '/telefones',
                        json: true
                    };

                    request.get(options, function (err, response, body) {
                        if (err) {
                            return done(err);
                        }

                        expect(response.statusCode).to.be(200);
                        expect(body).to.be.an(Array);
                        expect(body.length).to.be(1);
                        done();
                    });
                });
            });
        });
        it('"GET /users/{id}/telefones" with wrong id should return 404', function (done) {

            var options = {
                url: 'http://127.0.0.1:8012/api/users/00000759a6d4007c2e410b25/telefones',
                json: true
            };

            request.get(options, function (err, response, body) {
                if (err) {
                    return done(err);
                }

                expect(response.statusCode).to.be(404);
                expect(body.error).to.be('Not Found');
                done();
            });
        });

        it('"GET /users/{id}/telefones" with Invalid id should return 500', function (done) {

            var options = {
                url: 'http://127.0.0.1:8012/api/users/00000/telefones',
                json: true
            };
            request.get(options, function (err, response, body) {
                if (err) {
                    return done(err);
                }
                
                expect(response.statusCode).to.be(500);
                expect(body.error.name).to.be('CastError');
                done();
            });
        });
	});
});
