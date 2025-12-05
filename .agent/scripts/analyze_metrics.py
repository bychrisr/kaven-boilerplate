#!/usr/bin/env python3
# .agent/scripts/analyze_metrics.py
import json
from datetime import datetime
from collections import defaultdict
import sys

def load_metrics(filepath='.agent/telemetry/metrics.json'):
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"❌ Metrics file not found: {filepath}")
        sys.exit(1)
    except json.JSONDecodeError:
        print(f"❌ Invalid JSON in metrics file: {filepath}")
        sys.exit(1)

def format_duration(seconds):
    if seconds < 60:
        return f"{seconds:.1f}s"
    elif seconds < 3600:
        return f"{seconds/60:.1f}m"
    else:
        return f"{seconds/3600:.1f}h"

def main():
    data = load_metrics()
    executions = data['executions']
    
    if not executions:
        print("📊 No executions yet. Run some workflows first!")
        return
    
    # Group by workflow
    by_workflow = defaultdict(list)
    for exec in executions:
        by_workflow[exec['workflow_name']].append(exec)
    
    print("=" * 100)
    print("📊 KAVEN TELEMETRY ANALYSIS")
    print("=" * 100)
    print()
    
    # Workflow statistics
    print("🔧 WORKFLOW STATISTICS")
    print("-" * 100)
    print(f"{'Workflow':<30} {'Count':<8} {'Avg Time':<12} {'Total LOC':<12} {'Success Rate':<12}")
    print("-" * 100)
    
    for workflow, execs in sorted(by_workflow.items(), key=lambda x: len(x[1]), reverse=True):
        count = len(execs)
        avg_time = sum(e['duration_seconds'] for e in execs) / count
        total_loc = sum(e['lines_of_code'] for e in execs)
        success_rate = sum(1 for e in execs if e['success']) / count
        
        print(f"{workflow:<30} {count:<8} {format_duration(avg_time):<12} {total_loc:<12,} {success_rate:.1%}")
    
    print()
    print("=" * 100)
    
    # Overall summary
    summary = data['summary']
    print("📈 OVERALL SUMMARY")
    print("-" * 100)
    print(f"Project: {data['project']['name']}")
    print(f"Created: {data['project']['created_at']}")
    print()
    print(f"Total executions:     {summary['total_executions']:,}")
    print(f"Total duration:       {format_duration(summary['total_duration_seconds'])} ({summary['total_duration_seconds']/3600:.1f}h)")
    print(f"Total files created:  {summary['total_files_created']:,}")
    print(f"Total lines of code:  {summary['total_lines_of_code']:,}")
    print(f"Average duration:     {format_duration(summary['avg_duration_seconds'])}")
    print(f"Success rate:         {summary['success_rate']:.1%}")
    print()
    
    # Recent executions
    print("🕐 RECENT EXECUTIONS (Last 5)")
    print("-" * 100)
    recent = executions[-5:]
    for exec in reversed(recent):
        timestamp = datetime.fromisoformat(exec['timestamp_start'].replace('Z', '+00:00'))
        status = "✅" if exec['success'] else "❌"
        print(f"{status} {timestamp.strftime('%Y-%m-%d %H:%M')} | {exec['workflow_name']:<20} | {format_duration(exec['duration_seconds']):<10} | {exec['task_description'][:40]}")
    
    print()
    print("=" * 100)
    
    # Slowest executions
    print("🐌 SLOWEST EXECUTIONS (Top 5)")
    print("-" * 100)
    slowest = sorted(executions, key=lambda e: e['duration_seconds'], reverse=True)[:5]
    for exec in slowest:
        timestamp = datetime.fromisoformat(exec['timestamp_start'].replace('Z', '+00:00'))
        print(f"{timestamp.strftime('%Y-%m-%d %H:%M')} | {exec['workflow_name']:<20} | {format_duration(exec['duration_seconds']):<10} | {exec['task_description'][:40]}")
    
    print()
    print("=" * 100)
    print()
    print("💡 TIP: Use 'cat .agent/telemetry/metrics.json | jq' for more detailed analysis")
    print()

if __name__ == '__main__':
    main()
