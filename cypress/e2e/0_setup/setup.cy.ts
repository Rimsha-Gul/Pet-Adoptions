describe('Make sure DB is ready for testing', () => {
  it('sets up admin', () => {
    cy.task('addAdmin')
  })
})
