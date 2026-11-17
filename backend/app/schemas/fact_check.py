from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class EvidenceSourceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    domain: str
    url: str
    reliability_score: float
    is_official: bool


class EvidenceDocumentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    url: str
    snippet: str
    published_date: Optional[datetime] = None
    created_at: datetime
    source: EvidenceSourceOut


class FactCheckSearchResponse(BaseModel):
    total: int
    items: List[EvidenceDocumentOut]


class ClaimVerifyRequest(BaseModel):
    claim: str


class VerifiedEvidenceItem(BaseModel):
    id: int
    title: str
    url: str
    snippet: str
    source_name: str
    source_domain: str
    published_date: Optional[str] = None
    similarity_score: float
    nli_verdict: str  # SUPPORTS, REFUTES, NOT_ENOUGH_INFO


class ClaimVerifyResponse(BaseModel):
    claim: str
    overall_verdict: str
    matched_evidences: List[VerifiedEvidenceItem]
