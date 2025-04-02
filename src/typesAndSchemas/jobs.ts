import { z } from "zod"

export const jobSchema = z.object({
    id: z.number(),
    title: z.string(),
    type: z.number(),
    primary_details: z.object({
        Place: z.string(),
        Salary: z.string(),
        Job_Type: z.string(),
        Experience: z.string(),
        Fees_Charged: z.string(),
        Qualification: z.string()
    }),
    fee_details: z.object({ V3: z.array(z.unknown()) }),
    job_tags: z.array(
        z.object({
            value: z.string(),
            bg_color: z.string(),
            text_color: z.string()
        })
    ),
    job_type: z.number(),
    job_category_id: z.number(),
    qualification: z.number(),
    experience: z.number(),
    shift_timing: z.number(),
    job_role_id: z.number(),
    salary_max: z.number().nullable(),
    salary_min: z.number().nullable(),
    city_location: z.number(),
    locality: z.number(),
    premium_till: z.string().nullable(),
    content: z.string(),
    company_name: z.string(),
    advertiser: z.number(),
    button_text: z.string(),
    custom_link: z.string(),
    amount: z.string(),
    views: z.number(),
    shares: z.number(),
    fb_shares: z.number(),
    is_bookmarked: z.boolean(),
    is_applied: z.boolean(),
    is_owner: z.boolean(),
    updated_on: z.string(),
    whatsapp_no: z.string(),
    contact_preference: z.object({
        preference: z.number(),
        whatsapp_link: z.string(),
        preferred_call_start_time: z.string(),
        preferred_call_end_time: z.string()
    }),
    created_on: z.string(),
    is_premium: z.boolean(),
    creatives: z.array(
        z.object({
            file: z.string(),
            thumb_url: z.string(),
            creative_type: z.number()
        })
    ),
    videos: z.array(z.unknown()),
    locations: z.array(
        z.object({ id: z.number(), locale: z.string(), state: z.number() })
    ),
    tags: z.array(z.unknown()),
    contentV3: z.object({
        V3: z.array(
            z.object({
                field_key: z.string(),
                field_name: z.string(),
                field_value: z.string()
            })
        )
    }),
    status: z.number(),
    expire_on: z.string(),
    job_hours: z.string(),
    openings_count: z.number(),
    job_role: z.string(),
    other_details: z.string(),
    job_category: z.string(),
    num_applications: z.number(),
    enable_lead_collection: z.boolean(),
    is_job_seeker_profile_mandatory: z.boolean(),
    translated_content: z.object({}),
    job_location_slug: z.string(),
    fees_text: z.string(),
    question_bank_id: z.null(),
    screening_retry: z.null(),
    should_show_last_contacted: z.boolean(),
    fees_charged: z.number()
})

export const jobDBSchema = z.object({
    id: z.string(),
    title: z.string(),
    location: z.string(),
    salary: z.string(),
    phone: z.string(),
    description: z.string(),
    company: z.string(),
    saved_at: z.string().optional(),
});

type jobType = z.infer<typeof jobSchema>;

export type jobDBType = z.infer<typeof jobDBSchema>;

export default jobType;