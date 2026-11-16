import sys
import os

# Thêm thư mục backend vào sys.path để pytest có thể import app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
