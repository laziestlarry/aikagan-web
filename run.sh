#!/bin/bash
# Start Lead Capture Server
node /Users/pq/aikagan-web/backend/server.js &
SERVER_PID=$!

# Start Pipeline Monitor
node /Users/pq/aikagan-web/backend/pipeline_monitor.js &
MONITOR_PID=$!

echo "Aikagan Infrastructure Online."
echo "Server PID: $SERVER_PID"
echo "Monitor PID: $MONITOR_PID"

trap "kill $SERVER_PID $MONITOR_PID; exit" INT TERM
wait
