import fitz

AGENT_COLORS = {
    "engineering": (0.13, 0.59, 0.95),
    "cost":        (0.30, 0.69, 0.31),
    "timeline":    (1.00, 0.60, 0.00),
    "compliance":  (0.61, 0.15, 0.69),
    "safety":      (0.96, 0.26, 0.21),
}

AGENT_KEYWORDS = {
    "engineering": ["foundation", "structural", "column", "concrete", "seismic", "soil bearing"],
    "cost":        ["cost estimate", "per sqft", "budget", "material procurement", "labour cost"],
    "timeline":    ["project timeline", "completion", "phase", "schedule", "months"],
    "compliance":  ["building permit", "fire noc", "clearance", "approval", "certificate"],
    "safety":      ["safety", "hazard", "environmental", "fire", "protection", "worker"],
}

HIGH_RISK_AGENTS = ["safety", "compliance"]

def add_legend(page):
    """Add a color legend box at the top of the page."""
    legend_items = [
        ("Engineering", AGENT_COLORS["engineering"]),
        ("Cost",        AGENT_COLORS["cost"]),
        ("Timeline",    AGENT_COLORS["timeline"]),
        ("Compliance",  AGENT_COLORS["compliance"]),
        ("Safety",      AGENT_COLORS["safety"]),
    ]

    x, y = 30, 15
    box_w, box_h = 510, 22
    page.draw_rect(fitz.Rect(x, y, x + box_w, y + box_h),
                   color=(0.1, 0.1, 0.1), fill=(0.95, 0.95, 0.95), width=0.5)

    label_x = x + 8
    for label, color in legend_items:
        # Color swatch
        page.draw_rect(fitz.Rect(label_x, y + 5, label_x + 12, y + 17),
                       color=color, fill=color)
        # Label text
        page.insert_text((label_x + 15, y + 15), label,
                         fontsize=7, color=(0, 0, 0))
        label_x += 90

    # High risk note
    page.insert_text((x + box_w - 140, y + 15),
                     "⚠ Red border = High Risk",
                     fontsize=6.5, color=(0.8, 0, 0))

def annotate_pdf(input_path: str, output_path: str, agent_outputs: dict):
    doc = fitz.open(input_path)

    for page in doc:
        add_legend(page)

        for agent, keywords in AGENT_KEYWORDS.items():
            color = AGENT_COLORS[agent]
            is_high_risk = agent in HIGH_RISK_AGENTS

            for keyword in keywords:
                instances = page.search_for(keyword, quads=False)
                for inst in instances:
                    # Expand rect to cover full line height
                    expanded = fitz.Rect(
                        inst.x0,
                        inst.y0 - 2,
                        inst.x1,
                        inst.y1 + 2
                    )
                    highlight = page.add_highlight_annot(expanded)
                    highlight.set_colors(stroke=color)
                    highlight.update()

                    if is_high_risk:
                        page.draw_rect(expanded, color=(0.9, 0, 0), width=1.2)

    doc.save(output_path)
    doc.close()
    return output_path