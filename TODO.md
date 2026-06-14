# krkbus TODO

- [x] Investigate 500 on `POST /api/reservations/create` and locate failing logic in `ReservationService.createReservationByRouteAndDate`.
- [x] Make authenticated client resolution robust (handle missing/unsupported principal) and return proper 401 via `ResponseStatusException` instead of throwing generic RuntimeException.
- [ ] Re-run backend locally after setting JAVA_HOME (current environment missing JAVA_HOME) and verify endpoint works with a valid Authorization: Bearer token.
- [ ] Optionally optimize `tripRepository.findAll()` scan by adding a proper query method for route+date.

