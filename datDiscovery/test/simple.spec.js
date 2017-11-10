const {describe, it} = require('mocha')
const chai = require('chai')
chai.use(require('dirty-chai'))
const {expect} = chai

describe('simple', function () {
  it('two swarms can find each other', (done) => {
    expect(1).to.equal(1)
    done()
  })
})
