from datetime import datetime

def getDate():
    return datetime.now().strftime("%b %d, %H:%M")