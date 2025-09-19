const fs = require('fs');
const path = require('path');

// Fonction pour corriger les importations dans un fichier
function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Corriger les importations Dialog
    if (content.includes('from "@/components/ui/Dialog\';')) {
      content = content.replace(/from "@\/components\/ui\/Dialog';/g, 'from "@/components/ui/Dialog";');
      modified = true;
    }

    // Corriger les importations Button
    if (content.includes('from "@/components/ui/Button\';')) {
      content = content.replace(/from "@\/components\/ui\/Button';/g, 'from "@/components/ui/Button";');
      modified = true;
    }

    // Corriger les importations Input
    if (content.includes('from "@/components/ui/Input\';')) {
      content = content.replace(/from "@\/components\/ui\/Input';/g, 'from "@/components/ui/Input";');
      modified = true;
    }

    // Corriger les importations Select
    if (content.includes('from "@/components/ui/Select\';')) {
      content = content.replace(/from "@\/components\/ui\/Select';/g, 'from "@/components/ui/Select";');
      modified = true;
    }

    // Corriger les importations Textarea
    if (content.includes('from "@/components/ui/textarea"')) {
      content = content.replace(/from "@\/components\/ui\/textarea"/g, 'from "@/components/ui/Textarea"');
      modified = true;
    }

    // Corriger les importations Card
    if (content.includes('from "@/components/ui/card"')) {
      content = content.replace(/from "@\/components\/ui\/card"/g, 'from "@/components/ui/Card"');
      modified = true;
    }

    // Corriger les importations Table
    if (content.includes('from "@/components/ui/table"')) {
      content = content.replace(/from "@\/components\/ui\/table"/g, 'from "@/components/ui/Table"');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed imports in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Fonction pour parcourir récursivement les fichiers
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fixImportsInFile(filePath);
    }
  });
}

// Démarrer le processus
console.log('Fixing imports...');
processDirectory('./src');
console.log('Import fixes completed!');
