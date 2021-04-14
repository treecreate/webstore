describe( "Localization", () => {
    beforeEach( () => {
        cy.visit( "/" )
    } );

    it( "do be localized", () => {
        cy.get( "[data-cy=localization]" )
          .then( ( $localization ) => {
           cy.get( ".language-icon" )
             .then( ( $icon ) => {
                if ( $icon.attr( "data-cy" ) == "dk" ) {
                    cy.get( "[data-cy=dk]" ).invoke( "attr", "alt" ).should( "contain", "Danish" );
                } else {
                    cy.get( "[data-cy=en-US]" ).invoke( "attr", "alt" ).should( "contain", "English" );
                }
             } );
        } );
    } );
} );