#!/bin/bash
mkdir -p .agent/telemetry
touch .agent/telemetry/commands_tracker.txt

execute() {
    local cmd="$*"
    echo "🤖 Executing: $cmd"
    echo "$cmd" >> .agent/telemetry/commands_tracker.txt
    eval "$cmd"
    local status=$?
    if [ $status -ne 0 ]; then
        echo "❌ Falha no comando: $cmd"
        return $status
    fi
}
