#!/usr/bin/env node
// .agent/scripts/finalize_telemetry.js
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

function calculateLinesOfCode(files) {
  let total = 0;
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      total += content.split('\n').length;
    } catch (e) {
      console.error(`⚠️  Error reading ${file}:`, e.message);
    }
  }
  return total;
}

function estimateTokens(files) {
  let totalChars = 0;
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      totalChars += content.length;
    } catch (e) {
      console.error(`⚠️  Error reading ${file}:`, e.message);
    }
  }
  return Math.ceil(totalChars / 4); // ~4 chars per token
}

function getGitBranch() {
  try {
    const branch = fs.readFileSync('.git/HEAD', 'utf8').trim();
    return branch.replace('ref: refs/heads/', '');
  } catch (e) {
    return null;
  }
}

function main() {
  const contextPath = '.agent/telemetry/current_execution.json';
  const metricsPath = '.agent/telemetry/metrics.json';

  // Check if context exists
  if (!fs.existsSync(contextPath)) {
    console.error('❌ No current execution context found at:', contextPath);
    console.error('   Make sure your workflow initialized telemetry with STEP 0');
    process.exit(1);
  }

  try {
    // Read context
    const context = JSON.parse(fs.readFileSync(contextPath, 'utf8'));
    
    // Read existing metrics
    if (!fs.existsSync(metricsPath)) {
      console.error('❌ Metrics file not found at:', metricsPath);
      console.error('   Run setup first: create metrics.json from guide');
      process.exit(1);
    }
    const telemetry = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
    
    // Calculate final metrics
    const allFiles = [...(context.files_created || []), ...(context.files_modified || [])];
    const linesOfCode = calculateLinesOfCode(allFiles);
    const tokensEstimated = estimateTokens(allFiles);
    
    const now = new Date();
    const startTime = new Date(context.timestamp_start);
    const duration = (now - startTime) / 1000;
    
    const execution = {
      execution_id: randomUUID(),
      timestamp_start: context.timestamp_start,
      timestamp_end: now.toISOString(),
      duration_seconds: Math.round(duration * 100) / 100,
      workflow_name: context.workflow_name || 'unknown',
      task_description: context.task_description || 'No description',
      files_created: context.files_created || [],
      files_modified: context.files_modified || [],
      commands_executed: context.commands_executed || [],
      lines_of_code: linesOfCode,
      tokens_used_estimated: tokensEstimated,
      success: context.success !== false,
      error_message: context.error_message || null,
      user_feedback: context.user_feedback || null,
      metadata: {
        model: context.model || 'gemini-3-pro',
        agent_mode: context.agent_mode || 'fast',
        project_name: telemetry.project.name,
        git_branch: getGitBranch()
      }
    };
    
    // Append execution
    telemetry.executions.push(execution);
    
    // Recalculate summary
    const totalExecs = telemetry.executions.length;
    const successfulExecs = telemetry.executions.filter(e => e.success).length;
    
    telemetry.summary = {
      total_executions: totalExecs,
      total_duration_seconds: Math.round(telemetry.executions.reduce((sum, e) => sum + e.duration_seconds, 0) * 100) / 100,
      total_files_created: telemetry.executions.reduce((sum, e) => sum + e.files_created.length, 0),
      total_lines_of_code: telemetry.executions.reduce((sum, e) => sum + e.lines_of_code, 0),
      avg_duration_seconds: Math.round((telemetry.executions.reduce((sum, e) => sum + e.duration_seconds, 0) / totalExecs) * 100) / 100,
      success_rate: Math.round((successfulExecs / totalExecs) * 100) / 100
    };
    
    // Save metrics
    fs.writeFileSync(metricsPath, JSON.stringify(telemetry, null, 2));
    
    // Delete temp file
    fs.unlinkSync(contextPath);
    
    // Report
    console.log('✅ Task completed in', execution.duration_seconds + 's');
    console.log('   Workflow:', execution.workflow_name);
    console.log('   Files created:', execution.files_created.length);
    console.log('   Files modified:', execution.files_modified.length);
    console.log('   Lines of code:', execution.lines_of_code);
    console.log('   Estimated tokens:', execution.tokens_used_estimated);
    console.log('   Total executions:', totalExecs);
    console.log('   Success rate:', (telemetry.summary.success_rate * 100).toFixed(1) + '%');
    console.log('');
    console.log('📊 Metrics saved to:', metricsPath);
    
  } catch (error) {
    console.error('❌ Telemetry error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
