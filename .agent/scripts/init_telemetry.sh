#!/bin/bash
echo "{
  \"timestamp_start\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
  \"workflow_name\": \"$1\",
  \"task_description\": \"$2\",
  \"files_created\": [],
  \"files_modified\": [],
  \"commands_executed\": [],
  \"success\": true,
  \"agent_mode\": \"act\"
}" > .agent/telemetry/current_execution.json
