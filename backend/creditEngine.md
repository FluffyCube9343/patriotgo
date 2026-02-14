## Credit Engine (Hackathon Demo)

- Rate: `credits = miles * rate`. Default rate is `EXPO_PUBLIC_CREDIT_RATE_PER_MILE` (falls back to 4 credits/mile).
- Weekly driver earn cap: `EXPO_PUBLIC_WEEKLY_EARN_CAP` (default 200). Driver earnings are capped per week; riders still spend the full amount.
- Implementation: `services/creditEngine.js` uses an in-memory wallet for demo. Replace with persistent storage (DynamoDB) for production.

### API
- `estimateCredits(distanceMiles)`: returns credits for a trip.
- `getWalletBalance(userId)`: demo wallet balance.
- `processRideCompletion({ rideId, distanceMiles, riderIds, driverId })`:
  - Riders spend the full amount.
  - Driver earns up to the weekly cap; returns transaction summary with a `capped` flag if limited.

### Env (optional)
```
EXPO_PUBLIC_CREDIT_RATE_PER_MILE=4
EXPO_PUBLIC_WEEKLY_EARN_CAP=200
```

### Future (for real persistence)
- Add `Credits` table: PK `userId`, SK `txId`, attrs: `delta`, `type`, `rideId`, `balanceAfter`, `createdAt`.
- Track weekly earnings with a GSI on `userId` + `createdAt` (week bucket) to enforce caps server-side.
