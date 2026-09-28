# Pokemon

Een full stack single page webapplicatie (SPA) rondom het domein Pokémon. Gebruikers kunnen Pokémon, types en trainers bekijken, aanmaken, wijzigen en verwijderen. De applicatie is gebouwd als individueel project.

## Doel

Het doel van dit project is om een volledig functioneel informatiesysteem te bouwen rondom het Pokémon-domein, waarbij gebruik wordt gemaakt van een moderne full stack JavaScript/TypeScript architectuur. De nadruk ligt op een complete CRUD-applicatie met een overzicht-detail structuur, een robuuste backend en een gebruiksvriendelijke frontend.

## Functionaliteiten

- Overzicht van Pokémon, types en trainers
- Detailpagina's per entiteit
- CRUD-operaties op alle entiteiten (aanmaken, wijzigen, inzien, verwijderen)
- Filteren en selecteren van informatie over alle drie de entiteiten
- Gebruikersauthenticatie met een aparte User-entiteit
- About-page met uitleg over de casus, het datamodel en de functionele requirements

## Architectuur

Het project is opgezet volgens een moderne full stack architectuur:

- **Frontend:** SPA met web-based user-interface
- **Backend:** NestJS framework met een RESTful API
- **Databases:** NoSQL document- en graph databases
- **Monorepo:** Nx monorepo structuur voor zowel frontend als backend
- **CI/CD:** Ontwikkelstraat met geautomatiseerde tests en deployment
- **Testing:** Zowel frontend als backend zijn getest met testcases

## Datamodel

Het datamodel bestaat uit de entiteiten Pokémon, type, powermoves en trainers, aangevuld met een User-entiteit voor authenticatie en persoonsgegevens. De entiteiten zijn onderling gerelateerd via schemareferenties.

## Technologieën

- TypeScript
- NestJS
- Nx monorepo
- MongoDB
- RESTful API
- SPA frontend
- CI/CD
- Geautomatiseerde tests
