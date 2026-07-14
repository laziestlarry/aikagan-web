import subprocess
import sys

variables = {
    "SHOPIER_OSB_USERNAME": "f7a2f590dffb4a54153b7e733a3120e0",
    "SHOPIER_OSB_PASSWORD": "8f0095efb2386097369c82c2c9da1f4f",
    "SHOPIER_PAT": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJkMDg1MmYwZmM2ZGY0MDE0MmNiNjljYjc2ZGFlZmNiMCIsImp0aSI6IjBjZDYwYmEyNjQ1OWYzMDBjMTNkOTEzN2FmM2ZjMDM0ZTZmN2FiNDg0Mzk1ZmM2NTY4ZjI4ZTQxNjIyMzZmNWI3NDlhN2QxYWM0MWJiZWFmMDc0MDdlNTE0NjkyMmJhNzBlMDBkMDI3YTI5NTMwNWUxZjAzZGJiMGZiYWJlMTM4OGEyZjRhOWM1MGFmMmMzYzkxYmRiZmViM2RkZTc1NmQiLCJpYXQiOjE3NjkyMTkyNDgsIm5iZiI6MTc2OTIxOTI0OCwiZXhwIjoxOTI3MDA0MDA4LCJzdWIiOiIyNzk1MzE0Iiwic2NvcGVzIjpbIm9yZGVyczpyZWFkIiwib3JkZXJzOndyaXRlIiwicHJvZHVjdHM6cmVhZCIsInByb2R1Y3RzOndyaXRlIiwic2hpcHBpbmdzOnJlYWQiLCJzaGlwcGluZ3M6d3JpdGUiLCJkaXNjb3VudHM6cmVhZCIsImRpc2NvdW50czp3cml0ZSIsInBheW91dHM6cmVhZCIsInJlZnVuZHM6cmVhZCIsInJlZnVuZHM6d3JpdGUiLCJzaG9wOnJlYWQiLCJzaG9wOndyaXRlIl19.BRrIvPlHlgWdVy4AXAcQnmbRN_3iRXt9nA6-mgcrMZV4dKDNtbNsruNaAAb1GiF5npWvn8r-VF8JPELpcHzKK17FaGfIp2u8kr-ed9o3bDMmGQEZcXxTgJoYYrh_TOulYbYzaXvGKUQ185UFlnuirMWOlccynNvOMAmVDZkwnoyZ77RdMKPT3fa-oTnL-gYCxHbxH-MVrBdb-XeIx7B2i1VdvRxrzmqFHqpjQ2C11FbTdHI9o-abcj9Fo1XZh7Rm9nHQxQdW3496BnkNfmVCDcdi-HXxW6I7Lahbrm4rza3-sIA0WB8in02GfHx8LPLjHWZjVm8qpCXDgRO-zhgn9w",
    "GUMROAD_ACCESS_TOKEN": "cmbiaBjC1NPQ_B7q6aYQ87P-o0sUztEJDcNlOdNsVVI",
    "LEMONSQUEEZY_API_KEY": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NGQ1OWNlZi1kYmI4LTRlYTUtYjE3OC1kMjU0MGZjZDY5MTkiLCJqdGkiOiJkMWIxNjg3NjU3N2QwNzdkYmUwZWEyOGViZGYyMmFhZDY3ZWQ2NmEyN2VkY2NkNjAzZDNjMDM1YzFjOGIyOWIxMWY3MzQ0NGJmOWFhODQzYyIsImlhdCI6MTc3MTQyODgxNi43NDk3MjEsIm5iZiI6MTc3MTQyODgxNi43NDk3MjMsImV4cCI6MTc4NzAxMTIwMC4wMzYxOTcsInN1YiI6IjY1Mjk4ODciLCJzY29wZXMiOltdfQ.zgi1bLKlyL2xiB-BGx4r3wh85gk4KePhzh8d-0MYxaI-TBMspIceUSVeHb8gKPWqhgt6nesFg_7C1c_4fy_vomlojmYmOth_ztUh-cMOrKu8LzyaYQfeA8ZOgfRCU7GLsZtGPUVTNQrmraMEJrhZnrWqZTqSiMW2VHOxpMfTP-Pe_4D6CefUlqwU9nkIexAuJ3ouru853W3n-C3A-ISNznH-IehUQQdqM0til9f00WaEoStZI9dk8kE5DFXVbnUX41gKDlWWOiiIp5F0eULQNUGOLHKk9e8Szne4SZGhfegQHQ8VZd8fS7BfL85VHg6tk15fAqqEsQfSHNkRxH9koXbBgbjqeRbV5U7R5TpT7x-PpZ8oPncIx-c4gHjyez1WsfiYhmxNUsq5YLKKPPybPNKGC91M6wWB2Ae6TBMJ186k98oszpk227_3de9HGBP08S_qOcLrhxvZxqrWZT2R5IO4ZA1QhpHoZtvXIGCsHKHWBBxG5PhTQues1nD85iMNU05uqhQ6VrmV7qIeSUwAAHq7kYEJMH5ac-GH4LRCQy_7ZppmD3L29KyNmmkZFmEchQ5cBosURUsJPzb2a_jS8tmmKRI5khYE2vqzbr5-glh7UY6P0mofcWnNpRU4tkQyLHS2iLRl_kcxjhqkuJCZuq1Gty0bq9BMpERBywYGzlg",
    "LEMONSQUEEZY_STORE_ID": "autonomax"
}

print("⚙️ Setting Vercel environment variables...")
for key, val in variables.items():
    cmd = [
        "npx", "vercel", "env", "add", key, "production",
        "--value", val,
        "--yes", "--force"
    ]
    print(f"Adding {key}...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"❌ Failed to add {key}: {res.stderr.strip() or res.stdout.strip()}")
        sys.exit(1)
    else:
        print(f"✅ Successfully added {key}")

print("🎉 All environment variables set successfully!")
