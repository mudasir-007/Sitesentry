import re
import numpy as np

class ScheduleSimulator:
    """
    Monte Carlo simulation for construction schedule risk.
    Runs N simulations sampling from lognormal distributions
    to estimate probability of delay.

    """

    #typical phase durations in weeks(min, expected, max)

    PHASE_BENCHMARKS=  {
        "foundation": (4, 8, 16),
        "structure": (8, 16, 32),
        "finishing": (6, 12, 20),
        "electrical": (3, 6, 10),
        "plumbing": (3, 6, 10),
        "interior": (4, 8, 16)
    }

    def extract_timeline_months(self, text: str):
        """Extract stated project duration from report text."""
        patterns = [
            r'(\d+)\s*months?',
            r'(\d+)\s*weeks?',
        ]
        results = []
        for i, pattern in enumerate(patterns):
            matches = re.findall(pattern, text.lower())
            for m in matches:
                val = int(m)
                # convert weeks to months
                if i == 1:
                    val = round(val / 4.33)
                results.append(val)
        return results

    def simulate(self, stated_months: int, n_simulations: int = 3000):
        """
        Run Monte Carlo simulation against stated timeline.
        Returns probability of overrun and risk level.
        """
        # Total expected weeks from benchmarks
        total_weeks_samples = np.zeros(n_simulations)

        for phase, (min_w, exp_w, max_w) in self.PHASE_BENCHMARKS.items():
            mean = exp_w
            std = (max_w - min_w) / 4
            samples = np.random.lognormal(
                mean=np.log(mean),
                sigma=std / mean,
                size=n_simulations
            )
            total_weeks_samples += samples

        total_months_samples = total_weeks_samples / 4.33
        overrun_prob = float(np.mean(total_months_samples > stated_months))

        if overrun_prob > 0.7:
            risk = "HIGH"
        elif overrun_prob > 0.4:
            risk = "MEDIUM"
        else:
            risk = "LOW"

        return {
            "stated_months": stated_months,
            "simulated_mean_months": round(float(np.mean(total_months_samples)), 1),
            "overrun_probability": round(overrun_prob, 2),
            "risk_level": risk
        }

    def analyze(self, text: str):
        timelines = self.extract_timeline_months(text)
        if not timelines:
            return {"summary": "No timeline found in report", "simulations": []}
        results = [self.simulate(t) for t in timelines[:3]]
        return {"extracted_timelines_months": timelines[:3], "simulations": results}

