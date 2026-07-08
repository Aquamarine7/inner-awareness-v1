export type PainPoint = {
  id: string;
  user_id: string | null;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  vote_count: number;
  display_order: number;
  created_at: string;
};

export type Post = {
  id: string;
  user_id: string | null;
  title: string;
  slug: string;
  body: string | null;
  excerpt: string | null;
  pain_point_id: string | null;
  status: "draft" | "published";
  published_at: string | null;
  view_count: number;
  created_at: string;
};

export type PostWithPainPoint = Post & {
  pain_points: Pick<PainPoint, "id" | "title" | "slug"> | null;
};

export type SubmissionStatus = "pending" | "approved" | "rejected";
export type ReviewStatus = "unreviewed" | "accepted" | "overridden";

export type Submission = {
  id: string;
  user_id: string | null;
  body: string;
  submitter_name: string | null;
  status: SubmissionStatus;
  pain_point_id: string | null;
  ai_category: string | null;
  ai_category_source: string | null;
  ai_category_confidence: number | null;
  ai_category_review_status: ReviewStatus;
  ai_intensity_score: number | null;
  ai_intensity_score_source: string | null;
  ai_intensity_score_confidence: number | null;
  ai_intensity_score_review_status: ReviewStatus;
  created_at: string;
};

export type SubmissionWithPainPoint = Submission & {
  pain_points: Pick<PainPoint, "id" | "title" | "slug"> | null;
};

export type Vote = {
  id: string;
  user_id: string | null;
  pain_point_id: string;
  voter_fingerprint: string | null;
  created_at: string;
};

export type SubscriberStatus = "active" | "unsubscribed";

export type Subscriber = {
  id: string;
  user_id: string | null;
  email: string;
  first_name: string | null;
  source_post_id: string | null;
  status: SubscriberStatus;
  created_at: string;
};

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type AuditLog = {
  id: string;
  user_id: string | null;
  action: string;
  target_table: string | null;
  target_id: string | null;
  old_value: unknown;
  new_value: unknown;
  risk_level: RiskLevel | null;
  created_at: string;
};
