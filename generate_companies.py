import json
import random

def generate_full_dataset():
    companies = []
    
    # 1. CORE REAL COMPANIES (High Accuracy)
    # PUNE
    pune_real = [
        ("Persistent Systems", "SaaS", "IT Services", 23000, "10000+", 1000, "$1B-$10B", "Public", 1990, ["Java", "Salesforce", "AWS"]),
        ("KPIT Technologies", "SaaS", "Automotive Tech", 12000, "10000+", 400, "$100M-$500M", "Public", 1990, ["C++", "Embedded", "Python"]),
        ("Quick Heal", "CyberSecurity", "Antivirus", 1500, "1001-5000", 60, "$10M-$100M", "Public", 1995, ["C++", "Windows", "Python"]),
        ("Druva", "SaaS", "Data Protection", 1100, "1001-5000", 200, "$100M-$500M", "Private Late", 2008, ["AWS", "Python", "React"]),
        ("Icertis", "SaaS", "Contract Intel", 2500, "1001-5000", 250, "$100M-$500M", "Private Late", 2009, ["Azure", ".NET", "React"]),
        ("FirstCry", "E-commerce", "Retail", 3500, "1001-5000", 600, "$500M-$1B", "Public", 2010, ["PHP", "React Native", "AWS"]),
        ("ElasticRun", "Logistics", "B2B E-commerce", 800, "501-1000", 700, "$500M-$1B", "Series E", 2016, ["Python", "Azure", "React"]),
        ("Mindtickle", "SaaS", "Sales Readiness", 700, "501-1000", 80, "$10M-$100M", "Series E", 2011, ["Node.js", "AWS", "React"]),
        ("Xpressbees", "Logistics", "Delivery", 3000, "1001-5000", 400, "$100M-$500M", "Series F", 2015, ["Java", "AWS", "Oracle"]),
        ("PubMatic", "SaaS", "AdTech", 900, "501-1000", 250, "$100M-$500M", "Public", 2006, ["Java", "C++", "React"]),
        ("Faasos (Rebel Foods)", "Logistics", "Cloud Kitchen", 5000, "1001-5000", 300, "$100M-$500M", "Series F", 2011, ["Node.js", "React Native", "AWS"]),
        ("Zensar Technologies", "SaaS", "IT Services", 10000, "10000+", 600, "$500M-$1B", "Public", 1991, ["Java", ".NET", "Cloud"]),
        ("Cybage Software", "SaaS", "Product Eng", 7000, "5001-10000", 200, "$100M-$500M", "Private Late", 1995, ["Java", "React", "AWS"]),
        ("Bitwise Inc", "SaaS", "Digital Transformation", 1000, "1001-5000", 50, "$10M-$100M", "Private Late", 1996, ["Java", "Python", "Cloud"]),
        ("Scrut Automation", "SaaS", "Compliance", 150, "101-200", 10, "$1M-$10M", "Series A", 2021, ["Node.js", "React", "AWS"]),
        ("Trellissoft", "DevTools", "Automation", 50, "11-50", 2, "<$1M", "Seed", 2019, ["Python", "React", "Node.js"]),
    ]
    
    # MUMBAI
    mumbai_real = [
        ("Reliance Industries", "Infrastructure", "Conglomerate", 350000, "10000+", 100000, "$10B+", "Public", 1958, ["Oracle", "SAP", "Azure"]),
        ("HDFC Bank", "FinTech", "Banking", 170000, "10000+", 25000, "$10B+", "Public", 1994, ["Java", ".NET", "Oracle"]),
        ("Dream11", "SaaS", "Fantasy Sports", 1200, "1001-5000", 800, "$500M-$1B", "Private Late", 2008, ["Java", "AWS", "Node.js"]),
        ("Nykaa", "E-commerce", "Beauty Retail", 2500, "1001-5000", 650, "$500M-$1B", "Public", 2012, ["Node.js", "React", "AWS"]),
        ("BillDesk", "FinTech", "Payments", 800, "501-1000", 350, "$100M-$500M", "Private Late", 2000, ["Java", "Oracle", "WebSphere"]),
        ("Pharmeasy", "HealthTech", "Medicine", 4000, "1001-5000", 700, "$500M-$1B", "Private Late", 2015, ["Python", "React Native", "AWS"]),
        ("Pepperfry", "E-commerce", "Furniture", 1000, "501-1000", 50, "$10M-$100M", "Private Late", 2011, ["PHP", "Next.js", "AWS"]),
        ("BookMyShow", "SaaS", "Events", 1500, "1001-5000", 100, "$10M-$100M", "Private Late", 1999, ["Java", "React", "GCP"]),
        ("Cleartrip", "SaaS", "Travel", 800, "501-1000", 40, "$10M-$100M", "Private Late", 2006, ["Python", "React", "AWS"]),
        ("PayU India", "FinTech", "Payments", 1500, "1001-5000", 300, "$100M-$500M", "Private Late", 2011, ["Java", "Node.js", "Python"]),
        ("Pocket Aces", "SaaS", "Digital Media", 200, "201-500", 10, "$1M-$10M", "Private Late", 2013, ["JavaScript", "AWS", "React"]),
        ("Zepto", "Logistics", "Quick Commerce", 2000, "1001-5000", 250, "$100M-$500M", "Series E", 2021, ["Go", "React Native", "Node.js"]),
        ("Haptik", "AI/ML", "Conversational AI", 400, "201-500", 20, "$10M-$100M", "Private Late", 2013, ["Python", "AWS", "React"]),
    ]

    # FILLERS - 600 India total
    # Industry Pools
    industries = ["FinTech", "SaaS", "E-commerce", "HealthTech", "DevTools", "CyberSecurity", "Infrastructure", "AI/ML", "EdTech", "Logistics"]
    maharashtra_cities = ["Pune, Maharashtra", "Mumbai, Maharashtra", "Nagpur, Maharashtra", "Nashik, Maharashtra", "Aurangabad, Maharashtra"]
    india_cities = ["Bengaluru, Karnataka", "Chennai, Tamil Nadu", "Gurugram, Haryana", "Hyderabad, Telangana", "Noida, Uttar Pradesh", "Ahmedabad, Gujarat"]
    global_cities = ["San Francisco, CA", "London, UK", "Singapore", "Berlin, Germany", "Sydney, Australia", "New York, NY", "Seattle, WA"]

    regions = {
        "Pune, Maharashtra": "Asia",
        "Mumbai, Maharashtra": "Asia",
        "Nagpur, Maharashtra": "Asia",
        "Nashik, Maharashtra": "Asia",
        "Aurangabad, Maharashtra": "Asia",
        "Bengaluru, Karnataka": "Asia",
        "Chennai, Tamil Nadu": "Asia",
        "Gurugram, Haryana": "Asia",
        "Hyderabad, Telangana": "Asia",
        "Noida, Uttar Pradesh": "Asia",
        "Ahmedabad, Gujarat": "Asia",
        "San Francisco, CA": "North America",
        "London, UK": "Europe",
        "Singapore": "Asia",
        "Berlin, Germany": "Europe",
        "Sydney, Australia": "Global",
        "New York, NY": "North America",
        "Seattle, WA": "North America"
    }

    # Add real Pune/Mumbai
    for name, ind, sub, count, range_str, rev, rev_str, stage, foundation, tech in pune_real:
        companies.append({
            "name": name, "industry": ind, "subIndustry": sub, "employeeCount": count, "employeeRange": range_str,
            "revenueValue": rev, "revenueRange": rev_str, "fundingStage": stage, "founded": foundation, "techStack": tech,
            "location": "Pune, Maharashtra", "region": "Asia", "website": f"https://{name.lower().replace(' ', '')}.com",
            "linkedin": f"https://linkedin.com/company/{name.lower().replace(' ', '-')}",
            "contactEmail": f"info@{name.lower().replace(' ', '')}.in", "description": f"Leading {sub} company based in Pune."
        })

    for name, ind, sub, count, range_str, rev, rev_str, stage, foundation, tech in mumbai_real:
        companies.append({
            "name": name, "industry": ind, "subIndustry": sub, "employeeCount": count, "employeeRange": range_str,
            "revenueValue": rev, "revenueRange": rev_str, "fundingStage": stage, "founded": foundation, "techStack": tech,
            "location": "Mumbai, Maharashtra", "region": "Asia", "website": f"https://{name.lower().replace(' ', '')}.com",
            "linkedin": f"https://linkedin.com/company/{name.lower().replace(' ', '-')}",
            "contactEmail": f"contact@{name.lower().replace(' ', '')}.in", "description": f"Prominent {sub} player in Mumbai."
        })

    # Add other real Indian giants
    others_real = [
        ("TCS", "SaaS", "IT Services", 600000, "10000+", 25000, "$10B+", "Public", 1968, ["Java", "SAP", "Cloud"], "Mumbai, Maharashtra"),
        ("Infosys", "SaaS", "IT Services", 330000, "10000+", 18000, "$10B+", "Public", 1981, ["Java", ".NET", "Azure"], "Bengaluru, Karnataka"),
        ("Wipro", "SaaS", "IT Services", 250000, "10000+", 11000, "$10B+", "Public", 1945, ["Cloud", "Digital", "AI"], "Bengaluru, Karnataka"),
        ("HCL Tech", "SaaS", "IT Services", 220000, "10000+", 12000, "$10B+", "Public", 1976, ["Infrastructure", "Engineering", "Cloud"], "Noida, Uttar Pradesh"),
        ("Zerodha", "FinTech", "Trading", 1100, "1001-5000", 800, "$500M-$1B", "Private Late", 2010, ["Go", "Python", "PostgreSQL"], "Bengaluru, Karnataka"),
        ("Coach", "EdTech", "Learning", 500, "501-1000", 50, "$10M-$100M", "Series C", 2015, ["React", "Python"], "Pune, Maharashtra"),
        ("Unacademy", "EdTech", "Education", 4000, "1001-5000", 100, "$10M-$100M", "Series H", 2015, ["Java", "React", "AWS"], "Bengaluru, Karnataka"),
        ("Razorpay", "FinTech", "Payments", 3000, "1001-5000", 250, "$100M-$500M", "Series F", 2014, ["PHP", "React", "MySQL"], "Bengaluru, Karnataka"),
    ]

    for name, ind, sub, count, range_str, rev, rev_str, stage, foundation, tech, loc in others_real:
        companies.append({
            "name": name, "industry": ind, "subIndustry": sub, "employeeCount": count, "employeeRange": range_str,
            "revenueValue": rev, "revenueRange": rev_str, "fundingStage": stage, "founded": foundation, "techStack": tech,
            "location": loc, "region": regions[loc], "website": f"https://{name.lower().replace(' ', '')}.com",
            "linkedin": f"https://linkedin.com/company/{name.lower().replace(' ', '-')}",
            "contactEmail": f"admin@{name.lower().replace(' ', '')}.com", "description": f"Global {sub} giant."
        })

    # FILL THE REST TO 1000
    # Target: 600 India (Majority MH: Pune/Mumbai), 400 Global
    
    current_count = len(companies)
    target_india = 600
    target_total = 1000
    
    # Names lists
    prefixes = ["Tech", "Cloud", "Blue", "Digital", "Nexus", "Core", "Global", "Indian", "Smart", "Infinite", "Delta", "Alpha", "Star", "Vibe", "Flow", "Meta", "Swift", "Zen"]
    suffixes = ["Logic", "Systems", "Solutions", "Services", "Hub", "Labs", "Soft", "Works", "Box", "Node", "Edge", "Stack", "Point", "Link", "Sync", "Grow", "Path"]

    # India loop
    while len(companies) < target_india:
        loc = random.choice(maharashtra_cities if len(companies) < 450 else india_cities)
        name = f"{random.choice(prefixes)} {random.choice(suffixes)} {random.randint(1, 999)}"
        ind = random.choice(industries)
        count = random.randint(10, 5000)
        rev = random.randint(1, 500)
        
        companies.append({
            "name": name, "industry": ind, "subIndustry": f"Modern {ind}", "employeeCount": count, 
            "employeeRange": "1001-5000" if count > 1000 else "501-1000" if count > 500 else "11-50",
            "revenueValue": rev, "revenueRange": "$100M-$500M" if rev > 100 else "$10M-$100M" if rev > 10 else "$1M-$10M",
            "fundingStage": random.choice(["Seed", "Series A", "Series B", "Series C", "Private Late"]),
            "founded": random.randint(2005, 2023), "techStack": random.sample(["Python", "React", "AWS", "Java", "Node.js", "MySQL", "Go"], 3),
            "location": loc, "region": "Asia", "website": f"https://{name.lower().replace(' ', '')}.in",
            "linkedin": f"https://linkedin.com/company/{name.lower().replace(' ', '-')}",
            "contactEmail": f"contact@{name.lower().replace(' ', '')}.in", "description": f"Emerging {ind} startup in India."
        })

    # Global loop
    while len(companies) < target_total:
        loc = random.choice(global_cities)
        name = f"{random.choice(prefixes)}{random.choice(suffixes)}{random.randint(1, 999)}"
        ind = random.choice(industries)
        count = random.randint(100, 50000)
        rev = random.randint(10, 5000)

        companies.append({
            "name": name, "industry": ind, "subIndustry": f"Global {ind}", "employeeCount": count,
            "employeeRange": "10000+" if count > 10000 else "1001-5000",
            "revenueValue": rev, "revenueRange": "$1B-$10B" if rev > 1000 else "$500M-$1B" if rev > 500 else "$100M-$500M",
            "fundingStage": random.choice(["Series D", "Private Late", "Public"]),
            "founded": random.randint(1995, 2018), "techStack": random.sample(["Cloud", "AI", "Mobile", "Security", "Big Data"], 3),
            "location": loc, "region": regions[loc], "website": f"https://{name.lower().replace(' ', '')}.com",
            "linkedin": f"https://linkedin.com/company/{name.lower().replace(' ', '-')}",
            "contactEmail": f"sales@{name.lower().replace(' ', '')}.com", "description": f"Innovative {ind} solutions globally."
        })

    # Assign IDs
    for i, c in enumerate(companies):
        c['id'] = i + 1

    with open('frontend/src/data/companies.json', 'w') as f:
        json.dump(companies, f, indent=2)

    print(f"Total Companies: {len(companies)}")
    mh_count = len([c for c in companies if "Maharashtra" in c['location']])
    india_count = len([c for c in companies if c['region'] == "Asia" and c['location'] not in ["Singapore"]])
    print(f"India Companies: {india_count}")
    print(f"Maharashtra Companies: {mh_count}")

if __name__ == "__main__":
    generate_full_dataset()
