# Simulate a WhatsApp message coming from Twilio
$URL = "http://localhost:8000/api/webhook/whatsapp"
$MESSAGE = "URGENT Your SBI account is blocked please update your KYC immediately by clicking this link: http://bad-link.com"

echo "=========================================="
echo "🤖 Simulating WhatsApp Message to Twilio"
echo "Sending: '$MESSAGE'"
echo "=========================================="

# Twilio sends requests as form URLEncoded
$body = @{
    From = "whatsapp:+1234567890"
    To = "whatsapp:+0987654321"
    Body = $MESSAGE
}

# The endpoint returns raw XML because it is intended for a machine, but PowerShell parses it automatically
$response = Invoke-RestMethod -Uri $URL -Method POST -Body $body

echo "`n✅ Response received from Bhasha-Verify Webhook:"
echo "------------------------------------------"
# Show the nicely formatted text it sends back to WhatsApp
echo $response.Response.Message.Body
echo "------------------------------------------"

echo "`n🔔 Note: Go check the 'HISTORY' tab on your localhost:5173 website. You will see this scan was saved there too!"
