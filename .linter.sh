#!/bin/bash
cd /home/kavia/workspace/code-generation/newspulse-103942-2aa82e91/newspulse_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

