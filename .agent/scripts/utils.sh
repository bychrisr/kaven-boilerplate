#!/bin/bash
mkdir -p .agent/telemetry
touch .agent/telemetry/commands_tracker.txt

execute() {
    local cmd="$*"
    echo "🤖 Executing: $cmd"
    echo "$cmd" >> .agent/telemetry/commands_tracker.txt
    eval "$cmd"
    return $?
}
