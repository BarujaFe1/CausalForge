"""Generate professional placeholder assets for CausalForge README."""

from __future__ import annotations

from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError as exc:  # pragma: no cover
    raise SystemExit(
        "Pillow is required: pip install pillow"
    ) from exc

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
SHOTS = ASSETS / "screenshots"
ASSETS.mkdir(parents=True, exist_ok=True)
SHOTS.mkdir(parents=True, exist_ok=True)

BG = (11, 18, 32)
PANEL = (18, 26, 43)
ACCENT = (61, 214, 198)
TEXT = (232, 238, 252)
MUTED = (157, 176, 208)
LINE = (36, 48, 73)


def font(size: int):
    for name in (
        "C:/Windows/Fonts/segoeuib.ttf",
        "C:/Windows/Fonts/segoeui.ttf",
        "arial.ttf",
    ):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def draw_panel(draw: ImageDraw.ImageDraw, xy, title: str, body: str):
    x0, y0, x1, y1 = xy
    draw.rounded_rectangle(xy, radius=18, fill=PANEL, outline=LINE, width=2)
    draw.text((x0 + 22, y0 + 18), title, fill=ACCENT, font=font(22))
    draw.text((x0 + 22, y0 + 56), body, fill=MUTED, font=font(16))


def make_icon():
    img = Image.new("RGB", (512, 512), BG)
    d = ImageDraw.Draw(img)
    d.ellipse((56, 56, 456, 456), outline=ACCENT, width=18)
    d.polygon([(256, 110), (390, 360), (122, 360)], outline=ACCENT, width=14)
    d.line((180, 250, 332, 250), fill=TEXT, width=10)
    d.text((168, 390), "CF", fill=TEXT, font=font(64))
    img.save(ASSETS / "icon.png")


def make_hero():
    img = Image.new("RGB", (1600, 900), BG)
    d = ImageDraw.Draw(img)
    d.rectangle((0, 0, 1600, 900), fill=BG)
    d.text((72, 70), "CAUSALFORGE", fill=ACCENT, font=font(28))
    d.text((72, 130), "Causal question → Assumptions → Evidence → Decision", fill=TEXT, font=font(42))
    d.text(
        (72, 210),
        "Applied causal inference lab for campaigns, ops changes and product interventions.",
        fill=MUTED,
        font=font(24),
    )
    draw_panel(d, (72, 320, 520, 560), "Effect", "+34.8  ATT\n95% CI [21.2, 48.4]")
    draw_panel(d, (560, 320, 1020, 560), "Assumptions", "Parallel trends: assumed\nNo anticipation: assumed")
    draw_panel(d, (1080, 320, 1528, 560), "Decision memo", "Interval excludes zero under\nstated assumptions — validate.")
    draw_panel(d, (72, 600, 1528, 820), "Limitations", "Synthetic demo · simple DiD/matching · no automatic causality claims")
    img.save(ASSETS / "hero-cover.png")


def make_social():
    img = Image.new("RGB", (1280, 640), BG)
    d = ImageDraw.Draw(img)
    d.text((64, 180), "CausalForge", fill=ACCENT, font=font(64))
    d.text((64, 280), "Measure impact with method, uncertainty and limits.", fill=TEXT, font=font(32))
    d.text((64, 360), "Diff-in-Diff · Matching · Decision Memo", fill=MUTED, font=font(26))
    img.save(ASSETS / "social-preview.png")


def make_architecture():
    img = Image.new("RGB", (1600, 700), BG)
    d = ImageDraw.Draw(img)
    steps = [
        (60, "Question"),
        (300, "Hypotheses"),
        (560, "Method"),
        (800, "Estimate"),
        (1040, "Uncertainty"),
        (1300, "Decision"),
    ]
    d.text((60, 40), "CausalForge analytical journey", fill=TEXT, font=font(36))
    for i, (x, label) in enumerate(steps):
        d.rounded_rectangle((x, 220, x + 200, 360), radius=16, fill=PANEL, outline=ACCENT, width=2)
        d.text((x + 28, 270), label, fill=TEXT, font=font(24))
        if i < len(steps) - 1:
            d.line((x + 200, 290, steps[i + 1][0], 290), fill=LINE, width=4)
    d.text((60, 460), "Next.js UI  ·  FastAPI estimators  ·  Pandas/SciPy/statsmodels  ·  Synthetic seed data", fill=MUTED, font=font(22))
    img.save(ASSETS / "architecture-pipeline.png")


def make_shots():
    specs = [
        ("01-causal-question-builder.png", "Causal Question Builder", "Intervention, outcome, population and timing"),
        ("02-assumption-checklist.png", "Assumption Checklist", "Parallel trends, unconfoundedness, overlap"),
        ("03-effect-estimator.png", "Effect Estimator", "ATT, SE and 95% confidence interval"),
        ("04-uncertainty-panel.png", "Uncertainty Panel", "Interval interpretation and risk of overclaim"),
        ("05-decision-memo.png", "Decision Memo", "Executive summary with explicit limitations"),
        ("06-method-compare.png", "Method Compare (Phase 2)", "DiD vs matching side-by-side"),
        ("07-dag-canvas.png", "DAG Canvas (Phase 2)", "Simple causal graph for assumption review"),
        ("08-executive-report.png", "Executive Report", "Impact report ready for stakeholders"),
    ]
    for name, title, subtitle in specs:
        img = Image.new("RGB", (1400, 860), BG)
        d = ImageDraw.Draw(img)
        d.rounded_rectangle((40, 40, 1360, 820), radius=24, fill=PANEL, outline=LINE, width=2)
        d.text((80, 90), "CausalForge", fill=ACCENT, font=font(24))
        d.text((80, 150), title, fill=TEXT, font=font(48))
        d.text((80, 230), subtitle, fill=MUTED, font=font(26))
        d.rounded_rectangle((80, 320, 1320, 720), radius=18, fill=(14, 22, 36), outline=LINE, width=2)
        d.text((110, 360), "Preview placeholder — replace with product screenshots after UI polish.", fill=MUTED, font=font(22))
        d.text((110, 430), "Question → Hypotheses → Method → Evidence → Risk → Decision", fill=TEXT, font=font(24))
        img.save(SHOTS / name)


if __name__ == "__main__":
    make_icon()
    make_hero()
    make_social()
    make_architecture()
    make_shots()
    print(f"Assets written to {ASSETS}")
