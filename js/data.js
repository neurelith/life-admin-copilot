/* ============================================================
   LIFE ADMIN COPILOT — Market-Ready Data Model with Multi-Profiles
   Multi-profile life admin (Personal, Family Care, Business/Tax), payment settlement, WhatsApp/Gmail sync.
   ============================================================ */

const initialData = {
  activeProfile: "personal",
  profiles: {
    personal: {
      name: "Alex",
      email: "alex@example.com",
      avatar: "A",
      role: "Personal Operations",
      inboxCount: 5,
      pendingPayment: "₹2,840"
    },
    family: {
      name: "Dr. Patel",
      email: "family.care@example.com",
      avatar: "P",
      role: "Elderly Parents Care & Medical",
      inboxCount: 4,
      pendingPayment: "₹6,450"
    },
    business: {
      name: "Sarah",
      email: "sarah.consulting@example.com",
      avatar: "S",
      role: "Freelance & Business Tax Admin",
      inboxCount: 6,
      pendingPayment: "₹18,200"
    }
  },

  // Simulated Automated Feeds (WhatsApp & Gmail Ingestion)
  liveFeeds: [
    {
      id: "feed-1",
      channel: "whatsapp",
      channelName: "WhatsApp Housing Society Group",
      icon: "ph-whatsapp-logo",
      title: "Quarterly Water & Maintenance Notice",
      snippet: "Dear Residents, Q3 society maintenance of ₹3,500 due by August 20 via UPI.",
      amount: "₹3,500",
      date: "Received 10 mins ago",
      extracted: true
    },
    {
      id: "feed-2",
      channel: "gmail",
      channelName: "Gmail (billing@bescom.org)",
      icon: "ph-envelope-simple",
      title: "Monthly Power Utility E-Bill",
      snippet: "Consumer #908124: Power bill generated for ₹1,850. Due August 18.",
      amount: "₹1,850",
      date: "Received 1 hour ago",
      extracted: true
    }
  ],

  // Items currently on the Inbox triage list
  inbox: [
    {
      id: "inbox-1",
      source: "IIT Madras",
      sourceCategory: "education",
      sourceIcon: "ph-graduation-cap",
      title: "Semester Registration Circular (Autumn 2026)",
      summary: "Registration portal closes Aug 14 at 6:00 PM. Requires online payment of ₹500 and upload of student ID proof.",
      importance: "high",
      date: "Aug 14, 6:00 PM",
      amount: "₹500",
      payable: true,
      actions: ["Pay & Settle", "Convert to Task", "Archive"],
      rawText: "IIT Madras Academic Affairs: All PG/UG students must complete autumn semester course registration before August 14, 2026 18:00 IST. Mandatory ₹500 processing fee and verified Student ID proof required.",
      detectedObligations: [
        { type: "deadline", text: "Registration deadline: August 14, 6:00 PM", icon: "ph-clock" },
        { type: "payment", text: "Mandatory fee: ₹500", icon: "ph-currency-inr" },
        { type: "requirement", text: "Document required: Student ID Proof", icon: "ph-identification-card" }
      ]
    },
    {
      id: "inbox-2",
      source: "TANGEDCO",
      sourceCategory: "finance",
      sourceIcon: "ph-lightning",
      title: "Electricity Bill (Consumer No: 04-231-098)",
      summary: "Bill of ₹2,340 generated for billing cycle July-Aug. Due date is tomorrow, Aug 10.",
      importance: "high",
      date: "Due Tomorrow",
      amount: "₹2,340",
      payable: true,
      actions: ["1-Click Pay", "Snooze", "Dismiss"],
      rawText: "Tamil Nadu Generation and Distribution Corp: Your power consumption bill for Consumer No 04-231-098 is ₹2,340. Due date without surcharge: 10-Aug-2026.",
      detectedObligations: [
        { type: "payment", text: "Amount due: ₹2,340", icon: "ph-currency-inr" },
        { type: "deadline", text: "Due date: August 10 (Tomorrow)", icon: "ph-calendar-blank" }
      ]
    },
    {
      id: "inbox-3",
      source: "IRCTC",
      sourceCategory: "travel",
      sourceIcon: "ph-train",
      title: "e-Ticket Confirmation: PNR 4529018471",
      summary: "Train 12840 (MAS to HWH Mail). Departure Friday Aug 15 at 06:15 AM from Chennai Central. Coach B3, Seat 42.",
      importance: "medium",
      date: "Aug 15, 6:15 AM",
      amount: "₹1,890",
      payable: false,
      actions: ["Add to Calendar", "View Ticket", "Archive"],
      rawText: "Electronic Reservation Slip: PNR 4529018471, Train 12840 / HOWRAH MAIL, Date of Journey: 15-Aug-2026, From: CHENNAI CENTRAL (MAS) To: HOWRAH JN (HWH), Class: 3A, Coach: B3 Berths: 42 (MB).",
      detectedObligations: [
        { type: "travel", text: "Train Departure: Aug 15, 06:15 AM", icon: "ph-train" },
        { type: "requirement", text: "Carry Original Gov ID Proof (Aadhaar/Passport)", icon: "ph-shield-check" }
      ]
    },
    {
      id: "inbox-4",
      source: "Amazon.in",
      sourceCategory: "warranty",
      sourceIcon: "ph-shopping-bag",
      title: "Tax Invoice: Sony WH-1000XM5 Headphones",
      summary: "Order #408-9821034-7712391. Total ₹24,990. 2-Year Manufacturer Warranty valid until August 2028.",
      importance: "low",
      date: "Aug 8, 2026",
      amount: "₹24,990",
      payable: false,
      actions: ["Save to Documents", "View Receipt", "Archive"],
      rawText: "Tax Invoice/Bill of Supply / Amazon Retail India: Item: Sony WH-1000XM5 Noise Cancelling Wireless Headphones. Serial No: SN-8891024. Warranty: 24 Months Official.",
      detectedObligations: [
        { type: "warranty", text: "Warranty protected until August 2028", icon: "ph-certificate" },
        { type: "document", text: "Serial Number: SN-8891024", icon: "ph-barcode" }
      ]
    },
    {
      id: "inbox-5",
      source: "Apollo Hospitals",
      sourceCategory: "health",
      sourceIcon: "ph-first-aid",
      title: "Consultation Appointment: Dr. R. Sharma",
      summary: "Routine health checkup scheduled for Thursday Aug 14 at 4:30 PM. Fasting 8 hours prior required.",
      importance: "medium",
      date: "Aug 14, 4:30 PM",
      amount: "₹1,200",
      payable: true,
      actions: ["Pre-Pay Consultation", "Snooze", "Add Reminder"],
      rawText: "Apollo Clinic Greams Road: Appointment confirmed with Dr. Ramesh Sharma (Cardiology & General Health) for Thursday 14-Aug-2026 at 16:30. Note: Fasting blood glucose test requires 8 hours fasting.",
      detectedObligations: [
        { type: "event", text: "Doctor Visit: Thursday 4:30 PM", icon: "ph-calendar-check" },
        { type: "requirement", text: "Fasting 8 hours prior to appointment", icon: "ph-warning-circle" }
      ]
    }
  ],

  // Extracted actionable tasks
  tasks: [
    {
      id: "task-1",
      title: "Submit IITM Semester Registration",
      due: "Due Today · 6:00 PM",
      dueCategory: "today",
      urgency: "high",
      category: "education",
      sourceName: "IIT Madras — Registration Notice",
      whyExists: "Registration for the upcoming autumn term closes today. Missing it incurs late registration penalty.",
      amount: "₹500",
      payable: true,
      requirements: [
        { text: "Verify course selections on academic portal", completed: true },
        { text: "Pay semester registration fee of ₹500", completed: false },
        { text: "Upload scanned Student ID proof", completed: false }
      ],
      completed: false
    },
    {
      id: "task-2",
      title: "Pay Electricity Bill (TANGEDCO)",
      due: "Due Tomorrow · 11:59 PM",
      dueCategory: "tomorrow",
      urgency: "high",
      category: "finance",
      sourceName: "TANGEDCO Bill #04-231-098",
      whyExists: "Avoid power disruption and ₹150 late payment surcharge.",
      amount: "₹2,340",
      payable: true,
      requirements: [
        { text: "Open UPI or TANGEDCO quick pay portal", completed: false },
        { text: "Save transaction reference receipt", completed: false }
      ],
      completed: false
    },
    {
      id: "task-3",
      title: "Pack Travel Documents for Chennai Trip",
      due: "Due Thursday · 9:00 PM",
      dueCategory: "this-week",
      urgency: "medium",
      category: "travel",
      sourceName: "IRCTC Booking PNR 4529018471",
      whyExists: "Physical Aadhaar / ID proof is strictly checked by TTE during boarding.",
      amount: null,
      payable: false,
      requirements: [
        { text: "Physical Aadhaar card / Passport in travel bag", completed: true },
        { text: "Download offline IRCTC PDF ticket", completed: false },
        { text: "Noise cancelling headphones & charger", completed: false }
      ],
      completed: false
    },
    {
      id: "task-4",
      title: "Renew Vehicle Comprehensive Insurance",
      due: "Aug 22 · 10 days left",
      dueCategory: "upcoming",
      urgency: "medium",
      category: "finance",
      sourceName: "HDFC ERGO Policy Reminder #231908",
      whyExists: "Motor vehicle insurance policy #MN-90812 expires August 24.",
      amount: "₹6,850",
      payable: true,
      requirements: [
        { text: "Compare NCB (No Claim Bonus) rate", completed: true },
        { text: "Pay annual premium of ₹6,850", completed: false }
      ],
      completed: false
    },
    {
      id: "task-5",
      title: "Send Signed Apartment Rental Extension Notice",
      due: "Aug 28 · 16 days left",
      dueCategory: "upcoming",
      urgency: "low",
      category: "housing",
      sourceName: "Lease Agreement 2025-2026",
      whyExists: "Landlord requires 30-day advance notice for 11-month lease extension.",
      amount: null,
      payable: false,
      requirements: [
        { text: "Review 5% escalation clause", completed: true },
        { text: "WhatsApp landlord confirmation acknowledgement", completed: false }
      ],
      completed: false
    }
  ],

  // Chronological timeline agenda
  timeline: [
    {
      id: "time-1",
      day: "Today, Saturday Aug 9",
      dayKey: "today",
      time: "18:00",
      title: "IITM Registration portal deadline",
      type: "deadline",
      category: "education",
      color: "var(--urgency-high)",
      icon: "ph-clock"
    },
    {
      id: "time-2",
      day: "Today, Saturday Aug 9",
      dayKey: "today",
      time: "20:00",
      title: "Electricity bill settlement deadline",
      type: "deadline",
      category: "finance",
      color: "var(--urgency-high)",
      icon: "ph-lightning"
    },
    {
      id: "time-3",
      day: "Tomorrow, Sunday Aug 10",
      dayKey: "tomorrow",
      time: "10:30",
      title: "Weekly life admin review & triage",
      type: "task",
      category: "identity",
      color: "var(--accent)",
      icon: "ph-check-circle"
    },
    {
      id: "time-4",
      day: "Thursday, Aug 14",
      dayKey: "upcoming",
      time: "16:30",
      title: "Doctor appointment (Apollo Clinic)",
      type: "event",
      category: "health",
      color: "var(--cat-health)",
      icon: "ph-first-aid"
    },
    {
      id: "time-5",
      day: "Friday, Aug 15",
      dayKey: "upcoming",
      time: "06:15",
      title: "Train to Kolkata (MAS → HWH Mail)",
      type: "travel",
      category: "travel",
      color: "var(--cat-travel)",
      icon: "ph-train"
    }
  ],

  // Auto-categorized documents vault
  documents: [
    {
      id: "doc-1",
      title: "Passport (Republic of India)",
      category: "identity",
      categoryName: "Identity",
      icon: "ph-passport",
      issued: "15 Mar 2020",
      expires: "14 Mar 2030",
      fileType: "PDF",
      size: "2.4 MB",
      source: "Passport Seva Kendra",
      relatedTask: null,
      urgent: false
    },
    {
      id: "doc-2",
      title: "Sony WH-1000XM5 Tax Invoice & Warranty",
      category: "warranty",
      categoryName: "Warranty",
      icon: "ph-certificate",
      issued: "08 Aug 2026",
      expires: "08 Aug 2028",
      fileType: "PDF",
      size: "420 KB",
      source: "Amazon India",
      relatedTask: null,
      urgent: false
    },
    {
      id: "doc-3",
      title: "Residential Lease Agreement (11-Month)",
      category: "housing",
      categoryName: "Housing",
      icon: "ph-house-line",
      issued: "01 Sep 2025",
      expires: "31 Jul 2026",
      fileType: "PDF",
      size: "1.8 MB",
      source: "Notarized Stamp Paper",
      relatedTask: "Send Signed Apartment Rental Extension Notice",
      urgent: true
    },
    {
      id: "doc-4",
      title: "HDFC ERGO Comprehensive Car Insurance Policy",
      category: "finance",
      categoryName: "Finance",
      icon: "ph-shield-check",
      issued: "25 Aug 2025",
      expires: "24 Aug 2026",
      fileType: "PDF",
      size: "890 KB",
      source: "HDFC ERGO Portal",
      relatedTask: "Renew Vehicle Comprehensive Insurance",
      urgent: true
    },
    {
      id: "doc-5",
      title: "IRCTC e-Ticket Confirmation (PNR 4529018471)",
      category: "travel",
      categoryName: "Travel",
      icon: "ph-train",
      issued: "05 Aug 2026",
      expires: "15 Aug 2026",
      fileType: "PDF",
      size: "340 KB",
      source: "IRCTC Mobile",
      relatedTask: "Pack Travel Documents for Chennai Trip",
      urgent: false
    },
    {
      id: "doc-6",
      title: "IIT Madras Grade Transcript & Degree Certificate",
      category: "education",
      categoryName: "Education",
      icon: "ph-graduation-cap",
      issued: "10 Jul 2025",
      expires: "Permanent",
      fileType: "PDF",
      size: "3.1 MB",
      source: "Dean Academic Affairs",
      relatedTask: null,
      urgent: false
    }
  ],

  // Sample quick upload presets for instant interactive testing
  sampleUploads: [
    {
      label: "College Circular PDF",
      name: "IITM_Autumn26_Circular.pdf",
      category: "education",
      extracted: {
        title: "Semester Exam Form & Hall Ticket",
        deadline: "August 18, 2026",
        amount: "₹1,000",
        req: "Passport photograph & ID copy",
        confidence: "High",
        source: "Dean of Academic Affairs"
      }
    },
    {
      label: "Doctor Prescription Photo",
      name: "Apollo_Prescription_Aug9.jpg",
      category: "health",
      extracted: {
        title: "Cardiology Follow-Up & Medicine Refill",
        deadline: "August 16 (5-day course completion)",
        amount: "₹650",
        req: "Follow up consultation in 7 days",
        confidence: "Certain",
        source: "Apollo Clinic Dr. Ramesh"
      }
    },
    {
      label: "Airbnb Booking Confirmation",
      name: "Airbnb_Goa_Villa_Receipt.pdf",
      category: "travel",
      extracted: {
        title: "Goa Villa Check-in & Security Deposit",
        deadline: "Check-in: Aug 28, 2:00 PM",
        amount: "₹14,500 (Paid) + ₹3,000 Deposit on arrival",
        req: "Govt ID of all guests required at gate",
        confidence: "Certain",
        source: "Airbnb Confirmation #HM2910"
      }
    }
  ]
};
