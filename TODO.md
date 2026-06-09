# TODO - Owner: zarządzanie trasami i cenami

## Plan implementacji

- [ ] 1. Wdrożenie realnego zarządzania cenami dla Ownera w `Frontend/src/components/PricingBlock.tsx`:
  - [ ] pobieranie tras: `GET /api/routes`
  - [ ] pobieranie cen: `GET /api/routes/prices`
  - [ ] zmapowanie ceny do trasy
  - [ ] popup/dialog (podobny do innych) do edycji cen
  - [ ] zapis:
    - [ ] jeśli cena istnieje -> `PUT /api/routes/prices/{priceId}`
    - [ ] jeśli nie istnieje -> `POST /api/routes/prices` (jeśli endpoint tworzenia jest dostępny w backendzie)
  - [ ] odświeżenie listy po zapisie
- [ ] 2. Wdrożenie edycji istniejących tras w `Frontend/src/components/RoutesManagementBlock.tsx` (Edytuj w tabeli):
  - [ ] dialog: tryb create/edit
  - [ ] pobranie danych trasy do edycji: `GET /api/routes/routes/{routeId}`
  - [ ] zapis: `PUT /api/routes/routes/{routeId}` + `stopIds`
  - [ ] odświeżenie listy po zapisie
- [ ] 3. Weryfikacja i naprawa typów/TS kompilacji.
- [ ] 4. Uruchomienie FE i test manualny.
