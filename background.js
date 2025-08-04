chrome.runtime.onInstalled.addListener(e=>{"install"===e.reason&&chrome.storage.local.set({model:"claude-3-5-sonnet-20241022",contextStyle:"comprehensive"}),chrome.contextMenus.create({id:"optimize-selection",title:"Optimize with Labratorium",contexts:["selection"]})});chrome.runtime.onMessage.addListener((e,t,n)=>{return"optimizePrompt"===e.action?(r(e.data,n),!0):"getSettings"===e.action?(chrome.storage.local.get(["apiKey","model","contextStyle"]).then(e=>n({success:!0,settings:e})).catch(e=>n({success:!1,error:e.message})),!0):"saveSettings"===e.action?(chrome.storage.local.set(e.data).then(()=>n({success:!0})).catch(e=>n({success:!1,error:e.message})),!0):void 0});async function r(e,t){try{const{userPrompt:n,apiKey:r,model:o,contextStyle:s}=e;if(!n||!r)throw new Error("Missing required parameters");const a=await c(n,r,o,s);t({success:!0,optimizedPrompt:a})}catch(e){t({success:!1,error:e.message})}}async function c(e,t,n="claude-3-5-sonnet-20241022",r="comprehensive"){const o={comprehensive:`You are an expert prompt engineer. Analyze the user's prompt and return ONLY an improved version that follows prompt engineering best practices. Do not include explanations, analysis, or additional commentary.

Original Prompt:
{USER_PROMPT}

Improvement Guidelines: Apply these best practices to create a superior prompt:
• **Be explicit and specific**: Use clear action verbs (Analyze, Create, Extract, Generate, etc.) and specify desired output format, length, and style
• **Add helpful context**: Include relevant background information and specify target audience if needed
• **Use positive instructions**: Tell the AI what TO do rather than what NOT to do
• **Include examples**: Add 1-2 relevant examples if they would significantly improve clarity (few-shot prompting)
• **Specify output format**: Request structured output (JSON, markdown, bullet points) when appropriate
• **Add role context**: Include "Act as [expert role]" if it would improve the response
• **Request reasoning**: For complex tasks, ask for step-by-step thinking or explanation of approach
• **Control scope**: Be specific about depth, length, and focus areas

Instructions: Transform the original prompt into a significantly improved version that preserves the user's intent while applying prompt engineering best practices. Return ONLY the improved prompt in markdown format with no additional text, explanations, or formatting markers.`,quick:`You are an expert prompt engineer. Improve the following prompt by making it clearer, more specific, and better structured. Apply core prompt engineering principles: use clear action verbs, specify output format, add helpful context, and use positive instructions.

Original prompt: {USER_PROMPT}

Return ONLY the improved prompt in markdown format with no explanations.`,structured:`You are an expert prompt engineer specializing in structured prompts. Transform the following prompt using these principles:
• Clear action verbs and specific instructions
• Defined output format (markdown, JSON, bullets, etc.)
• Proper context and background information
• Step-by-step approach for complex tasks
• Specific scope and requirements

Original prompt: {USER_PROMPT}

Return ONLY the restructured prompt in markdown format that follows these best practices.`,creative:`You are an expert prompt engineer focused on creative enhancement. Improve the following prompt to unlock innovative AI responses by:
• Adding role context ("Act as [creative expert]")
• Encouraging multiple perspectives and original thinking
• Including example formats for creative outputs
• Specifying creative constraints and desired style
• Requesting iterative or exploratory approaches

Original prompt: {USER_PROMPT}

Return ONLY the enhanced creative prompt in markdown format with no additional commentary.`},s=(o[r]||o.comprehensive).replace("{USER_PROMPT}",e),a=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":t,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:n,max_tokens:1500,messages:[{role:"user",content:s}]})});if(!a.ok){const e=await a.json().catch(()=>({}));throw new Error(e.error?.message||`HTTP ${a.status}: ${a.statusText}`)}return(await a.json()).content[0].text}chrome.contextMenus.onClicked.addListener(async(e,t)=>{"optimize-selection"===e.menuItemId&&e.selectionText&&chrome.tabs.sendMessage(t.id,{action:"optimizeSelection",text:e.selectionText}).catch(e=>console.error("Failed to send message to content script:",e))});