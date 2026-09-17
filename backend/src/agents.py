from src.llm_engine import LLMEngine
from src.vectorstore import ReportVectorStore
from src.cost_engine import CostEngine
from src.schedule_simulator import ScheduleSimulator
from src.compliance_checklist import ComplianceChecker

class AgentPanel:
    def __init__(self):
        self.llm = LLMEngine()
        self.store = ReportVectorStore()
        self.cost_engine= CostEngine()
        self.schedule_sim = ScheduleSimulator()
        self.compliance = ComplianceChecker()


    # retrieval
    


    def _retrieve(self, query: str, report_id: str, top_k: int =4):
        results = self.store.query(query, report_id, top_k = top_k)
        docs= results.get("documents", [[]])[0]
        return "\n\n".join(docs)
        # retieval
    


    def engineering_agent(self, report_id: str, full_text: str):
        context = self._retrieve("structural design foundation materials specifications", report_id)
        prompt = f"""You are a senior structural reviewing a construction project report.
Analyze the following extracted sections for engineering feasibility.
Flag any missing structural details, design risks, or specification gaps.
Be concise and structured.

Report Sections:
{context}"""
        return self.llm.chat(system_prompt=prompt, user_message="Provide your engineering assessment.")

    def timeline_agent(self, report_id: str, full_text: str):
        context = self._retrieve("project timeline schedule phases completion duration", report_id)
        schedule_analysis = self.schedule_sim.analyze(full_text)
        prompt = f"""You are a construction project scheduler.
Review the project timeline. You also have Monte Carlo simulation results below.

Simulation Results: {schedule_analysis}

Report Sections:
{context}"""
        return self.llm.chat(system_prompt=prompt, user_message="Provide your timeline risk assessment.")

    def compliance_agent(self, report_id: str, full_text: str):
        context = self._retrieve("permits approvals clearance certificates regulatory", report_id)
        compliance_result = self.compliance.check(full_text)
        prompt = f"""You are a regulatory compliance expert for private construction projects in India.
Review compliance status. You have a deterministic checklist result below.

Checklist Result: {compliance_result}

Report Sections:
{context}"""
        return self.llm.chat(system_prompt=prompt, user_message="Provide your compliance assessment.")

    def safety_agent(self, report_id: str, full_text: str):
        context = self._retrieve("safety environment hazard risk site conditions", report_id)
        prompt = f"""You are a construction safety and environmental risk specialist.
Review the report for safety provisions, environmental concerns, and site hazards.
Flag missing safety measures or environmental risks.

Report Sections:
{context}"""
        return self.llm.chat(system_prompt=prompt, user_message="Provide your safety and environmental assessment.")

    def reviewer_agent(self, assessments: dict):
        summary = "\n\n".join([f"{k.upper()}:\n{v}" for k, v in assessments.items()])
        prompt = f"""You are the lead reviewer synthesizing assessments from 5 specialist agents.
Based on their findings, produce:
1. An overall risk score (0-100, higher = riskier)
2. A Go / Revise / No-Go recommendation
3. Top 3 critical issues
4. A brief executive summary

Agent Assessments:
{summary}"""
        return self.llm.chat(system_prompt=prompt, user_message="Provide your final consolidated review.")

    def run(self, report_id: str, full_text: str):
        assessments = {
            "engineering": self.engineering_agent(report_id, full_text),
            "cost": self.cost_engine.analyze(full_text),
            "timeline": self.timeline_agent(report_id, full_text),
            "compliance": self.compliance_agent(report_id, full_text),
            "safety": self.safety_agent(report_id, full_text),
        }
        assessments["reviewer"] = self.reviewer_agent(assessments)
        return assessments
    
