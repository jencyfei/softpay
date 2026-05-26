import os
from pathlib import Path

def rename_card_files(directory_path):
    """
    将指定目录下的所有文件重命名为 card_数字.jpg 格式
    
    Args:
        directory_path: 目标目录路径
    """
    # 转换为Path对象
    dir_path = Path(directory_path)
    
    # 检查目录是否存在
    if not dir_path.exists():
        print(f"错误: 目录 {directory_path} 不存在")
        return
    
    # 获取所有文件（排除子目录）
    files = [f for f in dir_path.iterdir() if f.is_file()]
    
    # 按文件名排序以保持一致性
    files.sort()
    
    print(f"找到 {len(files)} 个文件")
    print("\n开始重命名:")
    
    # 重命名文件
    for index, file_path in enumerate(files, start=1):
        # 获取文件扩展名
        extension = file_path.suffix
        
        # 如果没有扩展名，默认使用.jpg
        if not extension:
            extension = '.jpg'
        
        # 构建新文件名
        new_name = f"card_{index}{extension}"
        new_path = dir_path / new_name
        
        # 如果新文件名已存在，跳过
        if new_path.exists() and new_path != file_path:
            print(f"  跳过: {file_path.name} (目标文件名已存在)")
            continue
        
        # 重命名文件
        try:
            file_path.rename(new_path)
            print(f"  ✓ {file_path.name} -> {new_name}")
        except Exception as e:
            print(f"  ✗ 重命名失败 {file_path.name}: {e}")
    
    print("\n重命名完成!")

if __name__ == "__main__":
    # 目标目录路径
    target_directory = r"D:\tools\python\mypro\softpay\assets\card"
    
    print(f"目标目录: {target_directory}\n")
    rename_card_files(target_directory)
