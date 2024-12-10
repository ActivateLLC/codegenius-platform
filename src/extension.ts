import * as vscode from 'vscode';
import { AIService } from './services/ai-service';
import { EditorService } from './services/editor-service';
import { CollaborationService } from './services/collaboration-service';
import { UIManager } from './ui/ui-manager';

// Core extension activation
export function activate(context: vscode.ExtensionContext) {
    console.log('CodeGenius is now active!');

    // Initialize services
    const aiService = new AIService();
    const editorService = new EditorService();
    const collaborationService = new CollaborationService();
    const uiManager = new UIManager(context);

    // Register core commands
    context.subscriptions.push(
        vscode.commands.registerCommand('codegenius.assist', () => {
            uiManager.showAssistant();
        }),
        
        vscode.commands.registerCommand('codegenius.analyze', async () => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const code = editor.document.getText();
                const analysis = await aiService.analyzeCode(code);
                uiManager.showAnalysis(analysis);
            }
        }),

        vscode.commands.registerCommand('codegenius.generate', async () => {
            const result = await uiManager.showGenerateDialog();
            if (result) {
                const generatedCode = await aiService.generateCode(result);
                editorService.insertCode(generatedCode);
            }
        }),

        vscode.commands.registerCommand('codegenius.collaborate', () => {
            collaborationService.startSession();
        })
    );

    // Initialize workspace features
    editorService.initialize(context);
    collaborationService.initialize();
}

export function deactivate() {}