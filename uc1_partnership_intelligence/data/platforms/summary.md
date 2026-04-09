# WS Keyridge Asset Management — Research Summary

**Research date:** 6 April 2026
**Manager:** Keyridge Asset Management Limited (formerly Canada Life Asset Management)
**ACD:** Waystone Management UK Ltd
**AUM:** ~£135bn (group level, including Setana and Irish Life Investment Managers)

---

## Fund Data

### Confirmed ISINs: 28 share classes across 22 funds

| Category | Funds | ISINs Found | ISINs Missing |
|----------|-------|-------------|---------------|
| Portfolio III–VII | 5 funds | 7 of 10 | Portfolio V/VI/VII C Inc |
| DRM III–VI | 4 funds | 4 of 8 | DRM IV C Inc/Acc, DRM V/VI C Inc |
| Diversified Monthly Income | 1 fund | 2 of 2 | (C Inc unverified) |
| UK Equity | 1 fund | 1 of 2 | C Inc |
| UK Equity Income | 1 fund | 2 of 2 | — |
| UK Equity & Bond Income | 1 fund | 2 of 2 | — |
| European | 1 fund | 1 of 1 | (Acc only, no Inc class found) |
| Asia Pacific | 1 fund | 1 of 1 | (Acc only) |
| North American | 1 fund | 1 of 1 | (Acc only) |
| Global Equity | 1 fund | 1 of 1 | (Acc only) |
| Corporate Bond | 1 fund | 2 of 2 | — |
| Short Duration Corp Bond | 1 fund | 2 of 2 | — |
| Global Macro Bond | 1 fund | 1 of 2 | C Inc |
| Sterling Liquidity | 1 fund | 1 of 2 | I Inc |
| Sterling Short Term Bond | 1 fund | 2 (I + G class) | — |
| **TOTAL** | **22 funds** | **28 confirmed** | **~11 missing** |

### Funds with confirmed ISINs (C Acc, primary share class)

1. Portfolio III — GB00B96T7P76
2. Portfolio IV — GB00B976VR77
3. Portfolio V — GB00B9BQJ249
4. Portfolio VI — GB00B9BQBN99
5. Portfolio VII — GB00B76WGJ99
6. DRM III — GB00BZ005541
7. DRM V — GB00BLB05M23
8. DRM VI — GB00BP5J8Z72
9. Diversified Monthly Income — GB00BK5BDK84
10. UK Equity — GB00B9J7KW65
11. UK Equity Income — GB00B73RC112
12. UK Equity & Bond Income — GB00B6SC4F24
13. European — GB00BKRC1492
14. Asia Pacific — GB00B719QW87
15. North American — GB00B73N3278
16. Global Equity — GB00B78SPK99
17. Corporate Bond — GB00B6ZMK027
18. Short Duration Corporate Bond — GB00BD0CNM97
19. Global Macro Bond — GB00B4LW2X97
20. Sterling Liquidity (I class) — GB00BYW8XV16
21. Sterling Short Term Bond (I class) — GB00BN2S5T65

### Missing ISINs (require manual lookup)

- Portfolio V/VI/VII C Income classes — may not exist publicly
- DRM IV — both C Inc and C Acc ISINs unconfirmed (SEDOL BJP0XT7 found for C Inc only)
- DRM V/VI C Income classes
- UK Equity C Income
- Global Macro Bond C Income
- Sterling Liquidity I Income
- Regional equity funds (European, Asia Pacific, North American, Global Equity) — Income classes may not exist

### Data gaps across all funds

- **OCF:** Missing for all 22 funds. Requires individual Fidelity charges pages or KID documents.
- **Fund size/AUM:** Missing for all except DRM IV (~£77m from Yahoo Finance). Requires Fidelity key-statistics pages.
- **Benchmarks:** Partial. Portfolio/DRM ranges have Dynamic Planner benchmarks. Equity and bond funds: null.
- **Managers per fund:** Team-level only (Craig Rippe multi-asset, Mike Willans equities, Roger Dawes fixed income, Steve Matthews liquidity).

---

## Platform Presence

### Confirmed Present (7 platforms)

| Platform | Fund Count | Name In Use | Available to Buy |
|----------|-----------|-------------|-----------------|
| **Hargreaves Lansdown** | 13+ | WS Keyridge | Yes |
| **Fidelity FundsNetwork** | 8+ | WS Keyridge | Yes |
| **Interactive Investor** | 10+ | WS Keyridge | Yes |
| **AJ Bell** | 4+ | WS Canlife (old) | Yes |
| **Aviva** | 9+ | LF Canlife (oldest) | Yes (pension only) |
| **Charles Stanley Direct** | 15+ | LF/WS Canlife (old) | Yes |
| **Bestinvest** | 2 | LF Canlife (old) | Yes |

### Partially Confirmed (3 platforms)

| Platform | Evidence |
|----------|----------|
| **Aegon** | WS Canlife Sterling Liquidity referenced in platform PDF |
| **Quilter** | Name-change notice (Jan 2026) confirms fund range present. Adviser-only. |
| **Pershing** | LF Canlife Managed fund factsheet branded for Pershing on FundsLibrary |

### Confirmed Absent (2 platforms)

| Platform | Reason |
|----------|--------|
| **LV=** | Closed proprietary fund range |
| **Vanguard** | Vanguard-only fund range |

### Login Required / Cannot Confirm (25 platforms)

Standard Life, Transact, Nucleus, Scottish Widows, Zurich, Parmenion, True Potential, Elevate, M&G Wealth, Novia/Wealthtime, James Hay, 7IM, Raymond James, Curtis Banks, Hubwise, Fundment, InvestAcc, Praemium, Seccl, Copia Capital, Brooks Macdonald, Tatton, Ardan International, Utmost International

Most of these are adviser-only platforms with fund lists behind login portals. "Not found" means public confirmation is impossible — not that the funds are absent. Open-architecture platforms (Elevate, Novia/Wealthtime, Transact) are likely to carry the funds.

---

## Key Findings

1. **WS Keyridge rename has propagated unevenly.** HL, Fidelity, and II have adopted the new name. AJ Bell still shows "WS Canlife". Charles Stanley and Aviva still show "LF Canlife" (the oldest naming variant). Quilter's rename took effect 18 Feb 2026.

2. **Charles Stanley Direct has the largest publicly visible fund range** (15+ lines), but uses the oldest naming. This may indicate slower platform data updates.

3. **Aviva carries funds in pension wrappers only** under the oldest "LF Canlife" naming — these may be insurer-specific share classes.

4. **Zurich shows "Canlife Keyridge LS4/LS5"** share classes on Trustnet — these are insurer share classes suggesting pension distribution. Not the same as retail C class.

5. **The Setana funds** (EAFE Equity Strategy, European Equity, Multi-Asset SAMA, Global Equity) were not found on any platform searched. These may be institutional-only or Ireland-domiciled.

6. **Dynamic Planner alignment confirmed:** Portfolio III→RP3, IV→RP4, V→RP5, VI→RP6, VII→RP7. DRM range maps similarly.

7. **FundCalibre Elite rating** confirmed for Diversified Monthly Income fund.

8. **DRM IV is the most data-poor fund** — C Acc ISIN not found anywhere, C Inc has SEDOL only.

---

## Recommended Next Steps (Manual)

| Priority | Action | Expected Outcome |
|----------|--------|-----------------|
| 1 | Fetch individual Fidelity charges pages for each fund | OCF data for all funds |
| 2 | Fetch Fidelity key-statistics pages | Fund size/AUM for all funds |
| 3 | Contact Keyridge/Waystone for complete ISIN schedule | Fill all 11 missing ISINs + confirm DRM IV |
| 4 | Request Waystone fund registry access (fundsolutions.net) | Official ISIN/NAV/dealing data |
| 5 | Log into Transact, Quilter, Aegon with adviser credentials | Confirm presence on major advised platforms |
| 6 | Check Defaqto Engage for fund ratings and IFA panel data | Panel presence and ratings intelligence |
| 7 | Request Calastone/FE fundinfo data | Actual platform flow data (commercial licence) |
| 8 | Search for Setana funds on Irish fund databases | May be Ireland-domiciled UCITS |

---

## Rebranding Timeline

| Period | Fund Prefix | ACD | Investment Manager |
|--------|------------|-----|-------------------|
| Pre-2019 | LF Canlife | Link Fund Solutions | Canada Life Asset Management |
| ~2019–Sep 2025 | WS Canlife | Waystone Management UK | Canada Life Asset Management |
| Oct 2025–present | WS Keyridge | Waystone Management UK | Keyridge Asset Management |

---

*Research conducted via automated web search and public page analysis. No platform logins used. All ISINs sourced from publicly accessible URLs (Fidelity, Morningstar, Charles Stanley Direct, Willis Owen, Interactive Investor, AJ Bell). Data should be verified against official Waystone/Keyridge documentation before commercial use.*
