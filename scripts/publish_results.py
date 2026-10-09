"""Copy the notebooks' latest outputs into results/, where the website reads them.

Run after either notebook finishes:
    python scripts/publish_results.py
or as the last cell of a notebook:
    %run ../scripts/publish_results.py

Only files that exist are copied, so it is safe to run after just one notebook.
"""
import os
import shutil
import sys
from pathlib import Path

# outputs/<file the notebook writes>  ->  results/<file the website reads>
PUBLISH = {
    # Part 1: Sidra_Hotspots_Problem notebook
    "hotspots/hotspot_metrics.json": "reclaimed_land_metrics.json",
    "hotspots/figures/q1_reclamation_history.png": "reclamation_history.png",
    "hotspots/figures/q2_matched_land.png": "reclaimed_land_matched.png",
    "hotspots/figures/q3_hotspots.png": "reclaimed_land_hotspots.png",
    "hotspots/matched_land_annual.csv": "reclaimed_land_matched_annual.csv",
    "hotspots/matched_land_balance.csv": "reclaimed_land_matched_balance.csv",
    "hotspots/matched_land_coverage.csv": "reclaimed_land_matched_coverage.csv",
    "hotspots/matched_land_dates.csv": "reclaimed_land_matched_dates.csv",
    # Part 2: 02_surrounding_land_heat notebook
    "surrounding_land/notebook_summary.json": "surrounding_land_summary.json",
    "surrounding_land/13_headline_temperature_story.png": "surrounding_land_temperature.png",
    "surrounding_land/12_candidate_site_overview.png": "inspection_candidates.png",
    "surrounding_land/21_satellite_feature_comparison.png": "satellite_feature_comparison.png",
    "surrounding_land/satellite_feature_summary.csv": "satellite_feature_summary.csv",
    "surrounding_land/satellite_feature_settings.json": "satellite_feature_settings.json",
}


def find_root() -> Path:
    if "SIDRA_ROOT" in os.environ:
        return Path(os.environ["SIDRA_ROOT"]).resolve()
    start = Path.cwd().resolve()
    for p in [start, *start.parents]:
        if (p / "requirements.txt").is_file() and (p / "notebooks").is_dir():
            return p
    sys.exit("Could not find the repository root. Run this from inside the sidra folder.")


def main() -> None:
    root = find_root()
    outputs, results = root / "outputs", root / "results"
    results.mkdir(exist_ok=True)
    copied, missing = [], []
    for src, dst in PUBLISH.items():
        if (outputs / src).is_file():
            shutil.copy2(outputs / src, results / dst)
            copied.append(dst)
        else:
            missing.append(src)
    print(f"Published {len(copied)} file(s) to {results}:")
    for name in copied:
        print("  +", name)
    if missing:
        print(f"Skipped {len(missing)} file(s) not found in outputs/ (that notebook has not been run yet):")
        for name in missing:
            print("  -", name)
    if not copied:
        sys.exit("Nothing was published. Run a notebook first.")


if __name__ == "__main__":
    main()
