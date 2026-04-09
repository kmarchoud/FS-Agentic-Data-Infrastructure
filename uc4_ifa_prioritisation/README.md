# UC4: IFA Prioritisation

Ranks UK IFA firms by likelihood to distribute Keyridge funds.

## Data
- base_universe.csv: 9,833 UK financial firms (clean, deduplicated)
- keyridge_ranked.csv: 8,213 firms scored for Keyridge
- keyridge_briefs.json: Pre-call briefs for top 50 (pending)

## Scoring Model
Five components:
- Firm size (25%): adviser count + AUM band from VouchedFor
- FCA permissions (20%): 7 permission flags from FCA API
- Platform overlap (30%): platform mentions vs Keyridge platforms
- Mandate fit (15%): VouchedFor specialisms vs Keyridge fund range
- Signal score (10%): VouchedFor rating and review count

## Coverage
- 8,240 IFAs in universe (83% of FCA benchmark)
- FCA permissions: 46% of firms
- VouchedFor data: 17% of firms
- 8 confirmed platforms carrying Keyridge funds

## Pipeline
Run in order:
1. crawl_vouchedfor_api.py
2. crawl_fca_register.py
3. enrich_fca.py
4. enrich_permissions.py
5. match_fca.py
6. score_ifas.py
