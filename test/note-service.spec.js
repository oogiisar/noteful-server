'use strict';

require('dotenv').config();

const app = require('../src/app')
const knex = require('knex');

const NoteService = require('../src/note-service');

describe.only('Note service object', function() {
  let db;

  let testNotes = [
    {
      note_name: 'Important',
      id: 1,
      folder_id: 1
    },
    {
      note_name: 'Super',
      id: 2,
      folder_id: 1
    },
    {
      note_name: 'Spangley',
      id: 3,
      folder_id: 1
    }
  ];

  let newNote = [{ note_name: 'Grocery', id: 4, folder_id: 2 }];

  before('Get database instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db)
  });

  after('Close database', () => {
    db.destroy();
  });

  beforeEach('Reset the test database', () => {
    return db('note').truncate();
  });

  beforeEach('Insert test data into note table', () => {
    return db.into('note').insert(testNotes);
  });

  describe('getAllNotes', () => {
    it('it returns all notes from notes table', () => {
      return NoteService.getAllNotes(db).then(notes => {
        expect(notes).to.eql(testNotes);
      });
    });
  });

  describe.only('addNote', () => {
    it('it should add a folder to the folder table', () => {
      return NoteService.addNote(db, newNote).then(note => {
        expect(note).to.eql(newNote);
        console.log(note, newNote);
      });
    });
  });
});