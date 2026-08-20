const delay = (min = 200, max = 400) =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * (max - min) + min));

export async function getAdminKpis() {
  await delay();
  return {
    activeUsers: {
      value: 12450,
      changePercent: 5.2,
      changeLabel: "+640 from last month",
      breakdown: [
        { label: "Adopters", value: "8,240", trend: "up" },
        { label: "Vets", value: "1,120", trend: "up" },
        { label: "Centers", value: "3,090", trend: "flat" },
      ],
    },
    totalRevenue: {
      value: 45200,
      changePercent: 12.8,
      breakdown: [
        { label: "Store Sales", value: "$32,400" },
        { label: "Service Fees", value: "$12,800" },
      ],
    },
    pendingApprovals: {
      value: 28,
      priority: "High Priority",
      subtitle: "Pending Clinic Approvals",
      note: "License verification required",
    },
  };
}

export async function getPlatformHealth() {
  await delay();
  return {
    status: "Operational",
    apiResponseTime: { value: "240ms", percent: 85 },
    serverLoad: { value: "42%", percent: 42 },
    uptimeLast24h: "99.98%",
    loadHistory: [8, 12, 10, 14, 16, 12, 9],
  };
}

export async function getClinicPerformance() {
  await delay();
  return [
    { id: 1, name: "Downtown Pet Clinic", location: "New York, NY", orders: 142, growthPercent: 12, lastActive: "2 hours ago", status: "Active" },
    { id: 2, name: "Westside Veterinary", location: "Los Angeles, CA", orders: 89, growthPercent: 5, lastActive: "5 hours ago", status: "Active" },
    { id: 3, name: "North Star Animal Hospital", location: "Chicago, IL", orders: 28, growthPercent: 0, lastActive: "1 day ago", status: "Pending" },
    { id: 4, name: "Eastside Paws", location: "Miami, FL", orders: 64, growthPercent: 8, lastActive: "3 hours ago", status: "Active" },
    { id: 5, name: "Valley Vet Center", location: "Phoenix, AZ", orders: 12, growthPercent: -2, lastActive: "5 days ago", status: "Suspended" },
  ];
}

export async function getSystemAlerts() {
  await delay();
  return [
    { id: 1, severity: "warning", title: "High Memory Usage", detail: "Node-04 reporting 88% utilization" },
    { id: 2, severity: "error", title: "Email Gateway Timeout", detail: "124 notifications in queue" },
  ];
}

export async function getClinicApprovals() {
  await delay();
  return {
    pendingRequests: [
      {
        id: 1,
        name: "Paws & Care Vet Clinic",
        location: "Seattle, WA",
        logoUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCmnEfzMWEKaGwD4EEES8_cPAR3IxdVge_CMdlMOa2OQF3TnX_CtZM0xuYbgjCjswEtXHqxbJLodZPdbs3CMWOC6q5t1H4MGzNNc5tngSi7tQMIZu2uS6OLzqfAdy_PthhPyIQYVYh5b_C1RE5ZKZTHNg8YYABEp3SuGPHpf3Gg4PIzBMRsUAMsZZHGeSkGiGj6t0fKcjdUWKBrgy3HxxyeBp-qrQE5mx4U5I37zG-BsPsj3R2OZARL0YpABF5p5VrkoRPeb8fK1hrb",
        contactName: "Dr. Sarah Jenkins",
        contactEmail: "s.jenkins@pawsandcare.com",
        submissionDate: "Oct 24, 2023",
      },
      {
        id: 2,
        name: "Oakwood Animal Hospital",
        location: "Portland, OR",
        logoUrl: null,
        contactName: "Michael Chen",
        contactEmail: "admin@oakwoodah.com",
        submissionDate: "Oct 23, 2023",
      },
      {
        id: 3,
        name: "Green Valley Pet Hospital",
        location: "Denver, CO",
        logoUrl: null,
        contactName: "Dr. Laura Kim",
        contactEmail: "l.kim@greenvalleypets.com",
        submissionDate: "Oct 22, 2023",
      },
    ],
    recentDecisions: [
      {
        id: 1,
        name: "Sunshine Vet Partners",
        processedBy: "Admin: Emily R.",
        status: "approved",
        timestamp: "Today, 09:45 AM",
      },
      {
        id: 2,
        name: "City Paws Emergency Clinic",
        processedBy: "Admin: Marcus T.",
        status: "rejected",
        reason:
          "Submitted state veterinary license document was expired as of Sept 2023. Requested re-submission of current paperwork.",
        timestamp: "Yesterday, 14:20 PM",
      },
      {
        id: 3,
        name: "Whiskers & Tails Medical",
        processedBy: "Admin: Emily R.",
        status: "approved",
        timestamp: "Oct 21, 2023, 11:15 AM",
      },
    ],
  };
}

export async function getUsers() {
  await delay();
  return {
    totalCount: 1248,
    page: 1,
    pageSize: 4,
    totalPages: 312,
    security: {
      activeUsersPercent: 94,
      suspendedAccountsPercent: 4,
      bannedEntitiesPercent: 2,
    },
    users: [
      {
        id: "DOC-8472",
        name: "Dr. Sarah Jenkins",
        avatarUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAkjv_Fb8FE9lNq3eDP-pnsmVGIGtdsV5q_EDNY16urxNf0BlZ1ClzWjvAuihPeKmoVVb4E61EyYQF9HBUwflk7mDxTUy2jll0-tAZUpf-YeTIN-FOJo4jcCGd5ljXCZ8siZbqCsBKnrM5-EVeO7RGD2O-740Q1Ym2_sXJW-mlH7Y-T-lCQYrievctXMIBM_Y7EMhEEb6bY9haXyHQVt-YQmhFLYNbQKea9JcHohEepSTQElkQFkXLHw8StqdggZZLuZhV3fIQq2K6A",
        role: "Doctor",
        status: "active",
        joinedDate: "Oct 12, 2023",
        lastActive: "2 hours ago",
      },
      {
        id: "TRN-9931",
        name: "Paws & Train Co.",
        avatarUrl: null,
        initials: "PT",
        role: "Trainer",
        status: "suspended",
        joinedDate: "Jan 05, 2024",
        lastActive: "1 day ago",
      },
      {
        id: "CTR-1044",
        name: "City Vet Care",
        avatarUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuA2ZTpezHEJsaC7pBh8KVXL3N7UgV-PLfE47YyfsVv2YmaGhYt76E7prOGAx-MDZYiHHbyxILmdYktX02qINdaVVSsNdQUIsbe3Rs10pN3mEvuQW43j1RrB16ib33BmqZkOEHd0Qi9Er6GMBAtQ_MYeC-y5ewenNWE2IyMhBm1HZSw_VOUOqcgWXNgBgURAA5TQgs5rVbE6VvJYCmN40j3B2TZiOjwaFKDD2f9wjigp3_IPY3xp0KOaoKYKtMaUpBQLDgMAMHWif-Qc",
        role: "Center",
        status: "active",
        joinedDate: "Nov 22, 2023",
        lastActive: "Just now",
      },
      {
        id: "TRN-2284",
        name: "Mike Barnes",
        avatarUrl: null,
        initials: "MB",
        role: "Trainer",
        status: "banned",
        joinedDate: "Aug 14, 2023",
        lastActive: "Mar 01, 2024",
      },
    ],
  };
}

export async function getBlocklist() {
  await delay();
  return [
    {
      id: 1,
      entityId: "TRN-9931",
      reason: "Multiple unauthorized facility claims",
      justification: "Business justification: Violation of TOS 4.2",
      blockedAt: "2024-03-10 14:32 UTC",
      enforcement: "active_suspension",
    },
    {
      id: 2,
      entityId: "TRN-2284",
      reason: "Severe malpractice report (Verified)",
      justification: "Scientific justification: Endangerment protocol triggered",
      blockedAt: "2024-03-01 09:15 UTC",
      enforcement: "permanent_ban",
    },
    {
      id: 3,
      entityId: "DOC-5512",
      reason: "Expired veterinary license",
      justification: "System auto-flag: Pending document verification",
      blockedAt: "2024-02-28 11:00 UTC",
      enforcement: "resolved",
    },
  ];
}
