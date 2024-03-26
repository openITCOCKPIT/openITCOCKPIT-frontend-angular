# migration workshop

## Bestandsaufnahme

- Angular Vorkenntnisse: wenig. Tour of Heroes gemacht :) 
- angularJS: Grundkenntnisse => Advanced
- PHP Backend: insgesamt vorhanden

- 1 Monat Feature Freeze
- 2-3 Personen Migration
- 2-3 Feature Entwicklung

- Smartadmin: aktuell können nur Teile verwendet werden (Lizenzproblem)
  - basiert auf Bootstrap
- CSS :))))
- Migration auf Angular 18 (aktuell next)
- Aus Compliance und Security Gründen muss migriert werden
- Smartadmin basierend auf Bootstrap 5 - globale CSS Styles (kein SCSS)

 
## Todos
- Angular 18 App als Poc ✅
- Globale Styles implementieren ✅
- Skeleton ✅
  - Header (wie angularJS)
  - Navbar (wie angularJS)
- Navigation Concept
  - Query Params ✅
  - + wir benötigen einen State => nicht ✅
- Header
  - Websockets oder Polling zwischen den Clients
  - Uhrzeit - auto updates + Timezones
- Authentication Authorization
  - Login ✅
  - Logout ✅
    - csrf Token + Post Header
    - Permissions
      - 3-4 Level
      - permission UI directive
      - voraussichtlich kein routing check ✅
- Features / Module
- Angular i18n
  - i18n Evalurieren (voraussichtlich i18n extract von Angular)
- DTOs / Interfaces

- CI/CD 
- Script Loader für Standards Libs
  - TODO: welche Third Party Libs benötigen wir?
    - Gibt es TypeScript implementierungen / NPM Module?
      - https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types
      - TODO: Lizensen prüfen? 
- Context-Wechsel von AngularJS => Angular ✅
- 



- Voraussichtlich kein Store während der Migration
