"use strict";
/**
 * @file normal test
 * @module cookie-encryption
 * @package cookie-encryption
 * @subpackage test
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
    var cookiee = require('../index.min.js'); // use
    // require('cookie-encryption')
    var express = require('express');
    var cookie = require('cookie-parser');
    var request = require('supertest');
    var assert = require('assert');
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}

/*
 * test module
 */
describe('normal', function() {

    var arc4 = '2dc1ba510437';
    var arc4_b64 = 'LcG6UQQ%3D';
    var autokey = '%C3%98%C3%8E%C3%9C%C3%9C%C3%9E';
    var openssl = '%3E%C3%9D%C2%BBdA%C2%95%C3%A2%C2%B8';

    describe('arc4', function() {

        var app = express();
        before(function(done) {

            var vault = cookiee('hello_world!', {
                output: 'base64'
            });
            // express routing
            app.use(cookie('foo'));
            app.get('/', function(req, res) {

                res.send(vault.write(req, 'pippo'));
            });
            app.get('/r', function(req, res) {

                res.send(vault.read(req));
            });
            done();
        });

        it('nothing - should return "encrypted" cookie with base64', function(
                                                                              done) {

            request(app)
                    .get('/')
                    .expect(200)
                    .end(function(err, res) {

                        if (err)
                            return done(err);
                        var exp = 'vault=' + arc4_b64
                                + '; Max-Age=31536000; Path=/;';
                        var act = res.headers['set-cookie'][0]
                                .substring(0, exp.length);
                        assert.deepEqual(act, exp, 'static check');

                        request(app)
                                .get('/r')
                                .set('Cookie', 'vault=' + arc4_b64
                                        + '; Max-Age=31536000; Path=/;')
                                .expect(200)
                                .end(function(err, res) {

                                    if (err)
                                        return done(err);

                                    var convert = new Buffer(arc4_b64, 'base64');
                                    assert
                                            .equal(convert.toString('hex'), arc4, 'base64');

                                    var exp = new Buffer(res.text);
                                    // var act = new Buffer('pippo');
                                    assert
                                            .deepEqual(exp.toString('hex'), '706970706f000000', '"pippo"');
                                    done();
                                });
                    });
        });

        it('nothing - should return ""', function(done) {

            request(app).get('/r').expect(200).end(function(err, res) {

                if (err)
                    return done(err);
                assert.deepEqual(res.text, '', 'empty');
                done();
            });
        });

        it('nothing - should return ""', function(done) {

            request(app).get('/r')
                    .set('Cookie', 'vault= ; Max-Age=31536000; Path=/;')
                    .expect(200).end(function(err, res) {

                        if (err)
                            return done(err);
                        assert.deepEqual(res.text, '', 'empty');
                        done();
                    });
        });
    });

    describe('autokey', function() {

        var app = express();
        before(function(done) {

            var vault = cookiee('hello_world!', {
                cipher: 'autokey'
            });
            // express routing
            app.use(cookie('foo'));
            app.get('/', function(req, res) {

                res.send(vault.write(req, 'pippo'));
            });
            app.get('/r', function(req, res) {

                res.send(vault.read(req));
            });
            done();
        });

        it('nothing - should return "encrypted" cookie', function(done) {

            request(app)
                    .get('/')
                    .expect(200)
                    .end(function(err, res) {

                        if (err)
                            return done(err);
                        var exp = 'vault=' + autokey
                                + '; Max-Age=31536000; Path=/;';
                        var act = res.headers['set-cookie'][0]
                                .substring(0, exp.length);
                        assert.deepEqual(act, exp, 'static check');

                        request(app)
                                .get('/r')
                                .set('Cookie', 'vault=' + autokey
                                        + '; Max-Age=31536000; Path=/;')
                                .expect(200)
                                .end(function(err, res) {

                                    if (err)
                                        return done(err);
                                    assert
                                            .deepEqual(res.text, 'pippo', '"pippo"');
                                    done();
                                });
                    });
        });

        it('nothing - should return ""', function(done) {

            request(app).get('/r').expect(200).end(function(err, res) {

                if (err)
                    return done(err);
                assert.deepEqual(res.text, '', 'empty');
                done();
            });
        });
    });

    describe('openssl', function() {

        var app = express();
        before(function(done) {

            var vault = cookiee('hello_world!', {
                cipher: 'des'
            });
            // express routing
            app.use(cookie('foo'));
            app.get('/', function(req, res) {

                res.send(vault.write(req, 'pippo'));
            });
            app.get('/r', function(req, res) {

                res.send(vault.read(req));
            });
            done();
        });

        it('nothing - should return "encrypted" cookie', function(done) {

            request(app)
                    .get('/')
                    .expect(200)
                    .end(function(err, res) {

                        if (err)
                            return done(err);
                        var exp = 'vault=' + openssl
                                + '; Max-Age=31536000; Path=/;';
                        var act = res.headers['set-cookie'][0]
                                .substring(0, exp.length);
                        assert.deepEqual(act, exp, 'static check');

                        request(app)
                                .get('/r')
                                .set('Cookie', 'vault=' + openssl
                                        + '; Max-Age=31536000; Path=/;')
                                .expect(200)
                                .end(function(err, res) {

                                    if (err)
                                        return done(err);
                                    assert
                                            .deepEqual(res.text, 'pippo', '"pippo"');
                                    done();
                                });
                    });
        });

        it('nothing - should return ""', function(done) {

            request(app).get('/r').expect(200).end(function(err, res) {

                if (err)
                    return done(err);
                assert.deepEqual(res.text, '', 'empty');
                done();
            });
        });
    });
});