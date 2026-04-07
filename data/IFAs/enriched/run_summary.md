# IFA Intelligence Pipeline — Run Summary

**Run date:** 2026-04-07 14:06
**Total firms:** 3821

## Universe

| Source | Count |
|--------|-------|
| FCA CSV (after filtering) | 3821 |
| PIMFA members matched | 16 |

## Enrichment Completion

| Field | Count | % |
|-------|-------|---|
| FCA API enriched | 3821 | 100% |
| Companies House matched | 0 | 0% |
| Has phone | 3799 | 99% |
| Has website | 2891 | 75% |

## Category Breakdown

| Category | Count |
|----------|-------|
| ar_practice | 1400 |
| dfm | 1257 |
| ifa | 1164 |

## Tier Breakdown

| Tier | Count |
|------|-------|
| tier_1 | 50 |
| tier_2 | 150 |
| tier_3 | 300 |
| tier_4 | 3321 |

## Top 20 Firms by Priority Score

| Rank | Firm | FRN | Category | Score | Sources |
|------|------|-----|----------|-------|--------|
| 1 | Enterprise Investment Partners LLP | 604439 | ifa | 84 | 2 |
| 2 | Cantor Fitzgerald Europe | 149380 | ifa | 79 | 2 |
| 3 | AES Financial Services Ltd | 464494 | ifa | 79 | 2 |
| 4 | Verso Wealth Management Limited | 153871 | ifa | 79 | 2 |
| 5 | Waystone Financial Investments Limited | 169586 | ifa | 79 | 2 |
| 6 | Ermin Fosse Financial Management LLP | 197438 | ifa | 79 | 2 |
| 7 | CG Wealth Planning Limited | 594155 | ifa | 79 | 2 |
| 8 | Ellis Bates Financial Solutions Limited | 114394 | ifa | 79 | 2 |
| 9 | Evelyn Partners Financial Planning Limit | 136414 | ifa | 79 | 2 |
| 10 | Tritax Securities LLP | 489702 | ifa | 79 | 2 |
| 11 | Financial Relationships LLP | 483315 | ifa | 79 | 2 |
| 12 | Foster Denovo Limited | 462728 | ifa | 79 | 2 |
| 13 | Collins Sarri Statham Investments Limite | 483868 | ifa | 79 | 2 |
| 14 | STIFEL EUROPE LIMITED | 178733 | ifa | 79 | 2 |
| 15 | Gallagher (Administration & Investment)  | 115057 | ifa | 79 | 2 |
| 16 | Prydis Wealth Limited | 432014 | ifa | 79 | 2 |
| 17 | AJ Bell Securities Limited | 155593 | ifa | 79 | 2 |
| 18 | Affinity Financial Awareness Limited | 409160 | ifa | 79 | 2 |
| 19 | Pharon Independent Financial Advisers Li | 138169 | ifa | 79 | 2 |
| 20 | Capita Pension Solutions Limited | 142484 | ifa | 79 | 2 |

## Data Quality

- Firms with disciplinary history: 53
- Firms with no phone or website: 20
- Firms with zero individuals: 220

## Recommended Next Steps

1. Run full pipeline (all 3821 firms) with: `python3 pipeline.py --full`
2. Add Companies House API key for CH enrichment
3. Add VouchedFor/Unbiased web scraping (Phases not yet implemented)
4. Add website intelligence scraping (Phase 5)
5. Add news signal detection (Phase 6)
