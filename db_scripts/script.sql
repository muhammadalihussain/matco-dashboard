USE [master]
GO
/****** Object:  Database [AdminDashboard]    Script Date: 04/22/2025 17:15:08 ******/
CREATE DATABASE [AdminDashboard] ON  PRIMARY 
( NAME = N'AdminDashboard', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL10_50.DBSVR\MSSQL\DATA\AdminDashboard.mdf' , SIZE = 3072KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'AdminDashboard_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL10_50.DBSVR\MSSQL\DATA\AdminDashboard_log.ldf' , SIZE = 7168KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [AdminDashboard] SET COMPATIBILITY_LEVEL = 100
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [AdminDashboard].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [AdminDashboard] SET ANSI_NULL_DEFAULT OFF
GO
ALTER DATABASE [AdminDashboard] SET ANSI_NULLS OFF
GO
ALTER DATABASE [AdminDashboard] SET ANSI_PADDING OFF
GO
ALTER DATABASE [AdminDashboard] SET ANSI_WARNINGS OFF
GO
ALTER DATABASE [AdminDashboard] SET ARITHABORT OFF
GO
ALTER DATABASE [AdminDashboard] SET AUTO_CLOSE OFF
GO
ALTER DATABASE [AdminDashboard] SET AUTO_CREATE_STATISTICS ON
GO
ALTER DATABASE [AdminDashboard] SET AUTO_SHRINK OFF
GO
ALTER DATABASE [AdminDashboard] SET AUTO_UPDATE_STATISTICS ON
GO
ALTER DATABASE [AdminDashboard] SET CURSOR_CLOSE_ON_COMMIT OFF
GO
ALTER DATABASE [AdminDashboard] SET CURSOR_DEFAULT  GLOBAL
GO
ALTER DATABASE [AdminDashboard] SET CONCAT_NULL_YIELDS_NULL OFF
GO
ALTER DATABASE [AdminDashboard] SET NUMERIC_ROUNDABORT OFF
GO
ALTER DATABASE [AdminDashboard] SET QUOTED_IDENTIFIER OFF
GO
ALTER DATABASE [AdminDashboard] SET RECURSIVE_TRIGGERS OFF
GO
ALTER DATABASE [AdminDashboard] SET  DISABLE_BROKER
GO
ALTER DATABASE [AdminDashboard] SET AUTO_UPDATE_STATISTICS_ASYNC OFF
GO
ALTER DATABASE [AdminDashboard] SET DATE_CORRELATION_OPTIMIZATION OFF
GO
ALTER DATABASE [AdminDashboard] SET TRUSTWORTHY OFF
GO
ALTER DATABASE [AdminDashboard] SET ALLOW_SNAPSHOT_ISOLATION OFF
GO
ALTER DATABASE [AdminDashboard] SET PARAMETERIZATION SIMPLE
GO
ALTER DATABASE [AdminDashboard] SET READ_COMMITTED_SNAPSHOT OFF
GO
ALTER DATABASE [AdminDashboard] SET HONOR_BROKER_PRIORITY OFF
GO
ALTER DATABASE [AdminDashboard] SET  READ_WRITE
GO
ALTER DATABASE [AdminDashboard] SET RECOVERY FULL
GO
ALTER DATABASE [AdminDashboard] SET  MULTI_USER
GO
ALTER DATABASE [AdminDashboard] SET PAGE_VERIFY CHECKSUM
GO
ALTER DATABASE [AdminDashboard] SET DB_CHAINING OFF
GO
USE [AdminDashboard]
GO
/****** Object:  StoredProcedure [dbo].[usp_UserPagination]    Script Date: 04/22/2025 17:15:10 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_UserPagination]
    @page        INT,
    @size        INT,
    @search      NVARCHAR(MAX) = '',
    @orderBy     NVARCHAR(MAX) = 'ID',
    @orderDir    NVARCHAR(MAX) = 'DESC'
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @skip INT = (@size * @page) - @size;
    DECLARE @sql NVARCHAR(MAX);
    DECLARE @whereClause NVARCHAR(MAX) = '';
    
    -- Build WHERE clause if search is provided
    IF LTRIM(RTRIM(@search)) <> ''
    BEGIN
        SET @whereClause = N'WHERE LOWER(username) LIKE ''%'' + LOWER(@search) + ''%''
                           OR LOWER(email) LIKE ''%'' + LOWER(@search) + ''%''
                           OR LOWER(address) LIKE ''%'' + LOWER(@search) + ''%''';
    END
    
    -- Build complete query using ROW_NUMBER
    SET @sql = N'
    WITH PaginatedUsers AS (
        SELECT *,  (SELECT  [role_name] FROM [AdminDashboard].[dbo].[Roles]
  where id=role_id )as RoleName,
               ROW_NUMBER() OVER (ORDER BY ' + QUOTENAME(@orderBy) + ' ' + @orderDir + ') AS RowNum
        FROM [dbo].[User] 
        ' + @whereClause + '
    )
    SELECT * FROM PaginatedUsers
    WHERE RowNum BETWEEN ' + CAST(@skip + 1 AS NVARCHAR(20)) + ' AND ' + CAST(@skip + @size AS NVARCHAR(20)) + ';
    
    SELECT 
        (SELECT COUNT(*) FROM [dbo].[User] ' + @whereClause + ') AS Filtered,
        (SELECT COUNT(*) FROM [dbo].[User]) AS Total;';
    
    -- Execute the query
    EXEC sp_executesql @sql, N'@search NVARCHAR(MAX)', @search;
END


--EXEC [usp_UserPagination] @page = 1, @size = 5
--EXEC [usp_UserPagination] @page = 1, @size = 5, @search = 'a'
--EXEC [usp_UserPagination] @page = 1, @size = 5, @search = 'a', @orderBy = 'username', @orderDir = 'ASC'
--EXEC [usp_UserPagination] @page = 1, @size = 5, @search = '', @orderBy = 'username', @orderDir = 'ASC'
GO
/****** Object:  UserDefinedFunction [dbo].[fun_splitstring]    Script Date: 04/22/2025 17:15:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
Create FUNCTION [dbo].[fun_splitstring] ( @stringToSplit VARCHAR(8000) )
    RETURNS
        @returnList TABLE ([Param] [nvarchar] (500))
AS
 
BEGIN
 
    DECLARE @name NVARCHAR(255)
    DECLARE @pos INT
 
    WHILE CHARINDEX(',', @stringToSplit) > 0
    BEGIN
        SELECT @pos  = CHARINDEX(',', @stringToSplit) 
        SELECT @name = SUBSTRING(@stringToSplit, 1, @pos-1)
 
        INSERT INTO @returnList
        SELECT @name
 
        SELECT @stringToSplit = SUBSTRING(@stringToSplit, @pos+1, LEN(@stringToSplit)-@pos)
    END
 
    INSERT INTO @returnList
    SELECT @stringToSplit
 
    RETURN
END


--SELECT [Param] FROM dbo.splitstring('a,b,c')
GO
/****** Object:  Table [dbo].[Sites]    Script Date: 04/22/2025 17:15:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Sites](
	[SiteID] [int] IDENTITY(1,1) NOT NULL,
	[SiteCode] [varchar](20) NOT NULL,
	[SiteName] [varchar](100) NOT NULL,
	[IsActive] [bit] NULL,
	[CreatedDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[SiteID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[SiteCode] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
SET IDENTITY_INSERT [dbo].[Sites] ON
INSERT [dbo].[Sites] ([SiteID], [SiteCode], [SiteName], [IsActive], [CreatedDate]) VALUES (1, N'MRP', N'Matco Foods Ltd.', 1, CAST(0x0000B2B700F5BDCE AS DateTime))
INSERT [dbo].[Sites] ([SiteID], [SiteCode], [SiteName], [IsActive], [CreatedDate]) VALUES (2, N'RGD', N'Rice Glucose Division (RGD)', 0, CAST(0x0000B2B700F5BDCE AS DateTime))
INSERT [dbo].[Sites] ([SiteID], [SiteCode], [SiteName], [IsActive], [CreatedDate]) VALUES (3, N'BPD', N'Barentz Pakistan Private Limited', 0, CAST(0x0000B2B700F5BDCE AS DateTime))
INSERT [dbo].[Sites] ([SiteID], [SiteCode], [SiteName], [IsActive], [CreatedDate]) VALUES (4, N'MCS', N'Matco Corn Starch', 0, CAST(0x0000B2B700F5BDCE AS DateTime))
SET IDENTITY_INSERT [dbo].[Sites] OFF
/****** Object:  Table [dbo].[Roles]    Script Date: 04/22/2025 17:15:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Roles](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[role_name] [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[role_name] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
SET IDENTITY_INSERT [dbo].[Roles] ON
INSERT [dbo].[Roles] ([id], [role_name]) VALUES (1, N'admin')
INSERT [dbo].[Roles] ([id], [role_name]) VALUES (2, N'manager')
INSERT [dbo].[Roles] ([id], [role_name]) VALUES (3, N'user')
SET IDENTITY_INSERT [dbo].[Roles] OFF
/****** Object:  Table [dbo].[ProductionData]    Script Date: 04/22/2025 17:15:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductionData](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[supervisor] [nvarchar](100) NOT NULL,
	[runningHours] [int] NOT NULL,
	[downHours] [int] NOT NULL,
	[finalProduction] [int] NOT NULL,
	[biProductProduction] [int] NOT NULL,
	[remarks] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[ProductionData] ON
INSERT [dbo].[ProductionData] ([id], [supervisor], [runningHours], [downHours], [finalProduction], [biProductProduction], [remarks]) VALUES (1, N'Ali', 8, 2, 500, 50, N'Machine maintenance')
INSERT [dbo].[ProductionData] ([id], [supervisor], [runningHours], [downHours], [finalProduction], [biProductProduction], [remarks]) VALUES (2, N'Hasan', 7, 3, 450, 40, N'Power outage')
INSERT [dbo].[ProductionData] ([id], [supervisor], [runningHours], [downHours], [finalProduction], [biProductProduction], [remarks]) VALUES (3, N'Arif bhai', 9, 1, 550, 60, N'Material shortage')
SET IDENTITY_INSERT [dbo].[ProductionData] OFF
/****** Object:  Table [dbo].[Menus]    Script Date: 04/22/2025 17:15:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Menus](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[title] [varchar](100) NOT NULL,
	[url] [varchar](255) NOT NULL,
	[role_id] [int] NULL,
	[category] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
SET IDENTITY_INSERT [dbo].[Menus] ON
INSERT [dbo].[Menus] ([id], [title], [url], [role_id], [category]) VALUES (1, N'Dashboard', N'/dashboard', 1, N'Pages')
INSERT [dbo].[Menus] ([id], [title], [url], [role_id], [category]) VALUES (2, N'Users', N'/dashboard/users', 1, N'Pages')
INSERT [dbo].[Menus] ([id], [title], [url], [role_id], [category]) VALUES (3, N'Reports', N'/reports', 2, N'Analytics')
INSERT [dbo].[Menus] ([id], [title], [url], [role_id], [category]) VALUES (4, N'Settings', N'/settings', 2, N'User')
INSERT [dbo].[Menus] ([id], [title], [url], [role_id], [category]) VALUES (5, N'Profile', N'/profile', 3, N'User')
INSERT [dbo].[Menus] ([id], [title], [url], [role_id], [category]) VALUES (9, N'Dashboard', N'/dashboard', 2, N'Pages')
INSERT [dbo].[Menus] ([id], [title], [url], [role_id], [category]) VALUES (10, N'Reports', N'/reports', 1, N'Analytics')
INSERT [dbo].[Menus] ([id], [title], [url], [role_id], [category]) VALUES (11, N'Settings', N'/settings', 1, N'User')
INSERT [dbo].[Menus] ([id], [title], [url], [role_id], [category]) VALUES (12, N'Profile', N'/profile', 1, N'User')
INSERT [dbo].[Menus] ([id], [title], [url], [role_id], [category]) VALUES (16, N'Profile', N'/profile', 2, N'User')
SET IDENTITY_INSERT [dbo].[Menus] OFF
/****** Object:  StoredProcedure [dbo].[GetInventory]    Script Date: 04/22/2025 17:15:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- exec GetInventory 'mrp',null

CREATE Procedure [dbo].[GetInventory]
(
@dataareaid nvarchar(10),
@site nvarchar(20) =null
)

as

begin


DECLARE @sites TABLE (SiteName NVARCHAR(50));

if(@dataareaid='mrp' and  @site is null)
begin

INSERT INTO @sites VALUES 
    ('GODOWNS'), ('MATCO02'),   ('MATCO08'), ('RIVIANA');

end

else if (@dataareaid<>'mrp' and @site is null)
begin


INSERT INTO @sites 
select NAME from [MATCOAX].[dbo].INVENTSITE where  DATAAREAID= @dataareaid

end
else
begin
INSERT INTO @sites VALUES (@site)
end


if(@dataAreaId='mrp')

begin

	SELECT 
    CASE 
        WHEN left(Item.ItemGroupId,2) = '02' THEN 'BiProducts'
        WHEN Item.ItemGroupId IN ('0101', '0103','0109') THEN 'Raw'
        WHEN Item.ItemGroupId IN ('0102', '0104','0112') THEN 'SemiFinish'
        WHEN Item.ItemGroupId IN ('0401', '0402','0403','0405','0406') THEN 'Finishing'
        
        ELSE 'Other'
    END AS ItemCategory,
   -- SUM(ISNULL(Inv.PostedQty, 0)) + SUM(ISNULL(Inv.RECEIVED, 0)) - SUM(ISNULL(Inv.DEDUCTED, 0)) 
    --sum(ISNULL(Inv.AVAILPHYSICAL,0))  AS OnHandQuantity,
   
   
   
   Item.bomunitid ,
   
   CASE WHEN Item.bomunitid = 'Kg' THEN SUM(ISNULL(Inv.AVAILPHYSICAL,0) / 1000)
                        ELSE  SUM(ISNULL(Inv.AVAILPHYSICAL,0)) END AS AVAILPHYSICAL,
   
   SUM(ISNULL(Inv.AVAILPHYSICAL,0)) as QtyTon,
   ROUND(
        CASE
            WHEN left(Item.ItemGroupId,2) = '02' and Item.bomunitid = 'Kg' THEN SUM(ISNULL(Inv.AVAILPHYSICAL,0) / 1000)
                       
            WHEN Item.ItemGroupId IN ('0101', '0103','0109')  and Item.bomunitid = 'Kg'  THEN SUM(ISNULL(Inv.AVAILPHYSICAL,0) / 1000)
            
            WHEN Item.ItemGroupId IN ('0102', '0104','0112')   THEN SUM(ISNULL(Inv.AVAILPHYSICAL,0) / 1000)
            
            WHEN Item.ItemGroupId IN ('0401', '0402','0403','0405','0406')    THEN SUM(ISNULL(Inv.AVAILPHYSICAL,0) / 1000)
            
            ELSE SUM(ISNULL(Inv.AVAILPHYSICAL,0))
        END, 
    2) AS OnHandQuantityTon
   
   
   
INTO #TEMP_INVENTORY
FROM [MATCOAX].[dbo].InventSum AS Inv
JOIN [MATCOAX].[dbo].InventTable AS Item ON Inv.ItemId = Item.ItemId  and Inv.DATAAREAID = Item.DATAAREAID
JOIN [MATCOAX].[dbo].InventDim AS Dim ON Inv.InventDimId = Dim.InventDimId and Inv.DATAAREAID = Dim.DATAAREAID
JOIN [MATCOAX].[dbo].InventLocation AS WH  
    ON Dim.InventLocationId = WH.InventLocationId and WH.DATAAREAID = Dim.DATAAREAID
    AND WH.INVENTSITEID = Dim.INVENTSITEID AND WH.DATAAREAID = Dim.DATAAREAID
  
    
WHERE 

--left(Item.ItemGroupId,2) = '02' or Item.ItemGroupId IN ('0101', '0103','0109','0102', '0104','0112','0401', '0402','0403','0405','0406')
  
  
  --and 
  
  WH.DATAAREAID=@dataAreaId
AND 
   
     Dim.InventSiteId in (SELECT SiteName FROM @sites)


GROUP BY Item.ItemGroupId ,Item.bomunitid,
    CASE 
        WHEN left(Item.ItemGroupId,2) = '02' THEN 'BiProducts'
        WHEN Item.ItemGroupId IN ('0101', '0103','0109') THEN 'Raw'
        WHEN Item.ItemGroupId IN ('0102', '0104','0112') THEN 'SemiFinish'
        WHEN Item.ItemGroupId IN ('0401', '0402','0403','0405','0406') THEN 'Finishing'
        ELSE 'Other'
    END;
    
    
    
    SELECT ItemCategory ,SUM(OnHandQuantityTon) as OnHandQuantity FROM  #TEMP_INVENTORY
    where ItemCategory!='Other'
    group by ItemCategory 
    
    
--    SELECT 
--    'OnHandQuantity' AS Measure,
--    [BiProducts],
--    [Raw],
--    [SemiFinish],
--    [Finishing],
--    [Other]
--FROM 
--(
--    SELECT 
--        ItemCategory, 
--        SUM(OnHandQuantityTon) AS OnHandQuantity 
--    FROM #TEMP_INVENTORY
--     group by ItemCategory 
     
--) AS SourceTable
--PIVOT
--(
--    SUM(OnHandQuantity)
--    FOR ItemCategory IN ([BiProducts], [Raw], [SemiFinish], [Finishing], [Other])
--) AS PivotTable;
    
    
   
    
     drop table #TEMP_INVENTORY
    
    end
    
    
    
    else
    
    begin
    
    	SELECT 
    CASE 
        
      
        WHEN left(Item.ItemGroupId,2) = '02' THEN 'BiProducts'
        ELSE 'Other'
    END AS ItemCategory,
    --SUM(ISNULL(Inv.PostedQty, 0)) + SUM(ISNULL(Inv.RECEIVED, 0)) - SUM(ISNULL(Inv.DEDUCTED, 0)) 
    sum(ISNULL(Inv.AVAILPHYSICAL,0))
    AS OnHandQuantity
    
    
INTO #TEMP_INVENTORY1    
FROM [MATCOAX].[dbo].InventSum AS Inv
JOIN [MATCOAX].[dbo].InventTable AS Item ON Inv.ItemId = Item.ItemId  and Inv.DATAAREAID = Item.DATAAREAID
JOIN [MATCOAX].[dbo].InventDim AS Dim ON Inv.InventDimId = Dim.InventDimId and Inv.DATAAREAID = Dim.DATAAREAID
JOIN [MATCOAX].[dbo].InventLocation AS WH  
    ON Dim.InventLocationId = WH.InventLocationId and WH.DATAAREAID = Dim.DATAAREAID
    AND WH.INVENTSITEID = Dim.INVENTSITEID AND WH.DATAAREAID = Dim.DATAAREAID
WHERE 

--left(Item.ItemGroupId,2) ='02' 
--    and 
    
    
    WH.DATAAREAID=@dataAreaId and    Dim.InventSiteId in (SELECT SiteName FROM @sites) 
GROUP BY Item.ItemGroupId ,
    CASE 
        
        WHEN left(Item.ItemGroupId,2) = '02' THEN 'BiProducts'
        ELSE 'Other'
    END;
    
     SELECT ItemCategory ,SUM(OnHandQuantity) as OnHandQuantity FROM  #TEMP_INVENTORY1
     where ItemCategory!='Other'
    group by ItemCategory 
    --order by ItemCategory
    
    
--    SELECT 
--    'OnHandQuantity' AS Measure,
--    [BiProducts],
--    [Raw],
--    [SemiFinish],
--    [Finishing],
--    [Other]
--FROM 
--(
--    SELECT 
--        ItemCategory, 
--        SUM(OnHandQuantity) AS OnHandQuantity 
--    FROM #TEMP_INVENTORY1
--     group by ItemCategory 
    
--) AS SourceTable
--PIVOT
--(
--    SUM(OnHandQuantity)
--    FOR ItemCategory IN ([BiProducts], [Raw], [SemiFinish], [Finishing], [Other])
--) AS PivotTable;
    
    drop table #TEMP_INVENTORY1
    end
    




end
GO
/****** Object:  StoredProcedure [dbo].[GetFinishedGoodsAndBiProductsBySite]    Script Date: 04/22/2025 17:15:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetFinishedGoodsAndBiProductsBySite]
(@site nvarchar(100),@dataAreaId  nvarchar(100))
AS
BEGIN


if(@site='0' and @dataAreaId='0')

begin

	SELECT 
    CASE 
        --WHEN left(Item.ItemGroupId,2) = '04' THEN 'Finished Goods'
        WHEN Item.ItemGroupId IN ('0104', '0102') THEN 'Semi Finished Goods'
        WHEN left(Item.ItemGroupId,2) = '02' THEN 'Bi-Products'
        ELSE 'Other'
    END AS ItemCategory,
    --SUM(ISNULL(Inv.PostedQty, 0)) + SUM(ISNULL(Inv.RECEIVED, 0)) - SUM(ISNULL(Inv.DEDUCTED, 0))
    sum(ISNULL(Inv.AVAILPHYSICAL,0))
     AS OnHandQuantity
FROM [MATCOAX].[dbo].InventSum AS Inv
JOIN [MATCOAX].[dbo].InventTable AS Item ON Inv.ItemId = Item.ItemId
JOIN [MATCOAX].[dbo].InventDim AS Dim ON Inv.InventDimId = Dim.InventDimId
JOIN [MATCOAX].[dbo].InventLocation AS WH 
    ON Dim.InventLocationId = WH.InventLocationId
    AND WH.INVENTSITEID = Dim.INVENTSITEID
WHERE left(Item.ItemGroupId,2) = '02' or Item.ItemGroupId IN ('0104', '0102')
and  WH.DATAAREAID!='dat'

GROUP BY 
    CASE 
        WHEN Item.ItemGroupId IN ('0104', '0102') THEN 'Semi Finished Goods'
        WHEN left(Item.ItemGroupId,2) = '02' THEN 'Bi-Products'
        ELSE 'Other'
    END;
    
    end
    
    
   
    
  else  if(@site='0' and @dataAreaId!='0')

begin

	SELECT 
    CASE 
        WHEN Item.ItemGroupId IN ('0104', '0102') THEN 'Semi Finished Goods'
        WHEN left(Item.ItemGroupId,2) = '02' THEN 'Bi-Products'
        ELSE 'Other'
    END AS ItemCategory,
   -- SUM(ISNULL(Inv.PostedQty, 0)) + SUM(ISNULL(Inv.RECEIVED, 0)) - SUM(ISNULL(Inv.DEDUCTED, 0)) 
    sum(ISNULL(Inv.AVAILPHYSICAL,0))
    AS OnHandQuantity
FROM [MATCOAX].[dbo].InventSum AS Inv
JOIN [MATCOAX].[dbo].InventTable AS Item ON Inv.ItemId = Item.ItemId
JOIN [MATCOAX].[dbo].InventDim AS Dim ON Inv.InventDimId = Dim.InventDimId
JOIN [MATCOAX].[dbo].InventLocation AS WH 
    ON Dim.InventLocationId = WH.InventLocationId
    AND WH.INVENTSITEID = Dim.INVENTSITEID
  
    
    
   

    
WHERE left(Item.ItemGroupId,2) = '02' or Item.ItemGroupId IN ('0104', '0102')
  and WH.DATAAREAID=@dataAreaId
AND (
    (@dataAreaId <> 'mrp') -- If not 'mrp', no SITEID restriction
    OR 
    (@dataAreaId = 'mrp' AND WH.INVENTSITEID IN ('GODOWNS', 'MATCO02', 'MATCO08', 'RIVIANA'))
)

GROUP BY 
    CASE 
           WHEN Item.ItemGroupId IN ('0104', '0102') THEN 'Semi Finished Goods'
        WHEN left(Item.ItemGroupId,2) = '02' THEN 'Bi-Products'
        ELSE 'Other'
    END;
    
    end
    
    
    
    else
    
    begin
    
    	SELECT 
    CASE 
        
        WHEN Item.ItemGroupId IN ('0104', '0102') THEN 'Semi Finished Goods'
        WHEN left(Item.ItemGroupId,2) = '02' THEN 'Bi-Products'
        ELSE 'Other'
    END AS ItemCategory,
    --SUM(ISNULL(Inv.PostedQty, 0)) + SUM(ISNULL(Inv.RECEIVED, 0)) - SUM(ISNULL(Inv.DEDUCTED, 0)) 
    sum(ISNULL(Inv.AVAILPHYSICAL,0))
    AS OnHandQuantity
FROM [MATCOAX].[dbo].InventSum AS Inv
JOIN [MATCOAX].[dbo].InventTable AS Item ON Inv.ItemId = Item.ItemId
JOIN [MATCOAX].[dbo].InventDim AS Dim ON Inv.InventDimId = Dim.InventDimId
JOIN [MATCOAX].[dbo].InventLocation AS WH 
    ON Dim.InventLocationId = WH.InventLocationId
    AND WH.INVENTSITEID = Dim.INVENTSITEID
WHERE left(Item.ItemGroupId,2) ='02' or Item.ItemGroupId IN ('0104', '0102')
      and WH.INVENTSITEID =@site  and WH.DATAAREAID=@dataAreaId
GROUP BY 
    CASE 
        WHEN Item.ItemGroupId IN ('0104', '0102') THEN 'Semi Finished Goods'
        WHEN left(Item.ItemGroupId,2) = '02' THEN 'Bi-Products'
        ELSE 'Other'
    END;
    end
    

END
GO
/****** Object:  StoredProcedure [dbo].[GetDispatchInventory]    Script Date: 04/22/2025 17:15:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- exec GetDispatchInventory 'mrp',null

CREATE Procedure [dbo].[GetDispatchInventory]
(
@dataareaid nvarchar(10),
@site nvarchar(20) =null
)

as

begin


DECLARE @sites TABLE (SiteName NVARCHAR(50));

if(@dataareaid='mrp' and  @site is null)
begin

INSERT INTO @sites VALUES 
    ('GODOWNS'), ('MATCO02'),   ('MATCO08'), ('RIVIANA');

end

else if (@dataareaid<>'mrp' and @site is null)
begin


INSERT INTO @sites 
select NAME from [MATCOAX].[dbo].INVENTSITE where  DATAAREAID= @dataareaid

end
else
begin
INSERT INTO @sites VALUES (@site)
end


if(@dataAreaId='mrp')

begin

	SELECT 
    CASE 
        WHEN left(Item.ItemGroupId,2) = '02' or Item.ItemGroupId IN ('0102','0104','0112')   THEN 'BiProducts'
        WHEN Item.ItemGroupId IN ('0401', '0403') THEN 'Export'
        WHEN Item.ItemGroupId IN ('0402', '0405','0406') THEN 'LocalSND'
   
        
        ELSE 'Other'
    END AS ItemCategory,
   -- SUM(ISNULL(Inv.PostedQty, 0)) + SUM(ISNULL(Inv.RECEIVED, 0)) - SUM(ISNULL(Inv.DEDUCTED, 0)) 
    --sum(ISNULL(Inv.AVAILPHYSICAL,0))  AS OnHandQuantity,
   
   
   
   Item.bomunitid ,
   
   CASE WHEN Item.bomunitid = 'Kg' THEN SUM(ISNULL(Inv.AVAILPHYSICAL,0) / 1000)
                        ELSE  SUM(ISNULL(Inv.AVAILPHYSICAL,0)) END AS AVAILPHYSICAL,
   
   SUM(ISNULL(Inv.AVAILPHYSICAL,0)) as QtyTon,
   ROUND(
        CASE
            WHEN (left(Item.ItemGroupId,2) = '02' or Item.ItemGroupId IN ('0102','0104','0112'))  and Item.bomunitid = 'Kg' THEN SUM(ISNULL(Inv.AVAILPHYSICAL,0) / 1000)
                       
            WHEN Item.ItemGroupId IN ('0401', '0403')  THEN SUM(ISNULL(Inv.AVAILPHYSICAL,0))
            
            WHEN Item.ItemGroupId IN ('0102', '0104','0112')   THEN SUM(ISNULL(Inv.AVAILPHYSICAL,0))
            
            
            ELSE SUM(ISNULL(Inv.AVAILPHYSICAL,0))
        END, 
    2) AS OnHandQuantityTon
   
   
   
INTO #TEMP_INVENTORY
FROM [MATCOAX].[dbo].InventSum AS Inv
JOIN [MATCOAX].[dbo].InventTable AS Item ON Inv.ItemId = Item.ItemId  and Inv.DATAAREAID = Item.DATAAREAID
JOIN [MATCOAX].[dbo].InventDim AS Dim ON Inv.InventDimId = Dim.InventDimId and Inv.DATAAREAID = Dim.DATAAREAID
JOIN [MATCOAX].[dbo].InventLocation AS WH  
    ON Dim.InventLocationId = WH.InventLocationId and WH.DATAAREAID = Dim.DATAAREAID
    AND WH.INVENTSITEID = Dim.INVENTSITEID AND WH.DATAAREAID = Dim.DATAAREAID
  
    
WHERE 

--left(Item.ItemGroupId,2) = '02' or Item.ItemGroupId IN ('0101', '0103','0109','0102', '0104','0112','0401', '0402','0403','0405','0406')
  
  
  --and 
  
  WH.DATAAREAID=@dataAreaId
AND 
   
     Dim.InventSiteId in (SELECT SiteName FROM @sites)


GROUP BY Item.ItemGroupId ,Item.bomunitid,
    CASE 
        WHEN left(Item.ItemGroupId,2) = '02' or Item.ItemGroupId IN ('0102','0104','0112')   THEN 'BiProducts'
        WHEN Item.ItemGroupId IN ('0401', '0403') THEN 'Export'
        WHEN Item.ItemGroupId IN ('0402', '0405','0406') THEN 'LocalSND'
   
      
        ELSE 'Other'
    END;
    
    
    
    SELECT ItemCategory ,SUM(OnHandQuantityTon) as OnHandQuantity FROM  #TEMP_INVENTORY
    where ItemCategory!='Other'
    group by ItemCategory 
    
    
--    SELECT 
--    'OnHandQuantity' AS Measure,
--    [BiProducts],
--    [Raw],
--    [SemiFinish],
--    [Finishing],
--    [Other]
--FROM 
--(
--    SELECT 
--        ItemCategory, 
--        SUM(OnHandQuantityTon) AS OnHandQuantity 
--    FROM #TEMP_INVENTORY
--     group by ItemCategory 
     
--) AS SourceTable
--PIVOT
--(
--    SUM(OnHandQuantity)
--    FOR ItemCategory IN ([BiProducts], [Raw], [SemiFinish], [Finishing], [Other])
--) AS PivotTable;
    
    
   
    
     drop table #TEMP_INVENTORY
    
    end
    
    
    
    else
    
    begin
    
    	SELECT 
    CASE 
        
      
        WHEN left(Item.ItemGroupId,2) = '02' THEN 'BiProducts'
        ELSE 'Other'
    END AS ItemCategory,
    --SUM(ISNULL(Inv.PostedQty, 0)) + SUM(ISNULL(Inv.RECEIVED, 0)) - SUM(ISNULL(Inv.DEDUCTED, 0)) 
    sum(ISNULL(Inv.AVAILPHYSICAL,0))
    AS OnHandQuantity
    
    
INTO #TEMP_INVENTORY1    
FROM [MATCOAX].[dbo].InventSum AS Inv
JOIN [MATCOAX].[dbo].InventTable AS Item ON Inv.ItemId = Item.ItemId  and Inv.DATAAREAID = Item.DATAAREAID
JOIN [MATCOAX].[dbo].InventDim AS Dim ON Inv.InventDimId = Dim.InventDimId and Inv.DATAAREAID = Dim.DATAAREAID
JOIN [MATCOAX].[dbo].InventLocation AS WH  
    ON Dim.InventLocationId = WH.InventLocationId and WH.DATAAREAID = Dim.DATAAREAID
    AND WH.INVENTSITEID = Dim.INVENTSITEID AND WH.DATAAREAID = Dim.DATAAREAID
WHERE 

--left(Item.ItemGroupId,2) ='02' 
--    and 
    
    
    WH.DATAAREAID=@dataAreaId and    Dim.InventSiteId in (SELECT SiteName FROM @sites) 
GROUP BY Item.ItemGroupId ,
    CASE 
        
        WHEN left(Item.ItemGroupId,2) = '02' THEN 'BiProducts'
        ELSE 'Other'
    END;
    
     SELECT ItemCategory ,SUM(OnHandQuantity) as OnHandQuantity FROM  #TEMP_INVENTORY1
     where ItemCategory!='Other'
    group by ItemCategory 
    --order by ItemCategory
    
    
--    SELECT 
--    'OnHandQuantity' AS Measure,
--    [BiProducts],
--    [Raw],
--    [SemiFinish],
--    [Finishing],
--    [Other]
--FROM 
--(
--    SELECT 
--        ItemCategory, 
--        SUM(OnHandQuantity) AS OnHandQuantity 
--    FROM #TEMP_INVENTORY1
--     group by ItemCategory 
    
--) AS SourceTable
--PIVOT
--(
--    SUM(OnHandQuantity)
--    FOR ItemCategory IN ([BiProducts], [Raw], [SemiFinish], [Finishing], [Other])
--) AS PivotTable;
    
    drop table #TEMP_INVENTORY1
    end
    




end
GO
/****** Object:  StoredProcedure [dbo].[GetAllRole]    Script Date: 04/22/2025 17:15:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
Create Procedure [dbo].[GetAllRole]
as
begin

SELECT [id] ,[role_name] from [Roles]
end
GO
/****** Object:  StoredProcedure [dbo].[GetAllProductionData]    Script Date: 04/22/2025 17:15:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetAllProductionData]
	
AS
BEGIN
	WITH ShiftNumbers AS (
    SELECT 
      id, 
    'Shift ' + CAST(ROW_NUMBER() OVER (ORDER BY id) AS VARCHAR(10)) AS ShiftLabel
    FROM ProductionData
)
SELECT 
    s.ShiftLabel,
    'Product A' AS ProductA, 'Product B' AS ProductB, 'Product C' AS ProductC,
    'Waste A' AS WasteA, 'Waste B' AS WasteB, 'Waste C' AS WasteC,
    p.supervisor, p.runningHours, p.downHours, p.finalProduction, p.biProductProduction, p.remarks
FROM ProductionData p
JOIN ShiftNumbers s ON p.id = s.id;
END
GO
/****** Object:  StoredProcedure [dbo].[GetAllINVENTSITE]    Script Date: 04/22/2025 17:15:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE Procedure [dbo].[GetAllINVENTSITE]
@DataAreaId nvarchar(10)
as

if(@DataAreaId='mrp')
begin
select SITEID as Id,NAME from [MATCOAX].[dbo].INVENTSITE where  DATAAREAID= @DataAreaId
and SITEID in ('GODOWNS','MATCO02','MATCO08','RIVIANA')
end

else
begin
select SITEID as Id,NAME from [MATCOAX].[dbo].INVENTSITE where  DATAAREAID= @DataAreaId

end
GO
/****** Object:  StoredProcedure [dbo].[GetAllCompany]    Script Date: 04/22/2025 17:15:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[GetAllCompany]
as
select ID as Id,NAME  as Title from  [MATCOAX].dbo.dataArea as  da
--inner join [AdminDashboard].[dbo].[Sites]  as ad on ad.SiteCode=da.ID
--and ad.IsActive=1
where da.ID not in ('DAT') 
order by RecID asc
GO
/****** Object:  Table [dbo].[User]    Script Date: 04/22/2025 17:15:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[username] [nvarchar](50) NOT NULL,
	[email] [nvarchar](50) NOT NULL,
	[password] [nvarchar](max) NOT NULL,
	[img] [nvarchar](max) NULL,
	[isActive] [bit] NULL,
	[phone] [nvarchar](50) NULL,
	[address] [nvarchar](max) NULL,
	[createdAt] [datetime] NULL,
	[role_id] [int] NULL,
 CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[User] ON
INSERT [dbo].[User] ([Id], [username], [email], [password], [img], [isActive], [phone], [address], [createdAt], [role_id]) VALUES (15, N'M.Ali Hussain', N'muhammad.ali@matcofoods.com', N'$2b$10$usaXAAx.CUch.sImeuOlpubp8h88ih4biKUSvrNw6VpwdpHVTYEXW', N'', 1, N'03217256715', N'Test', CAST(0x0000B20400C9A27B AS DateTime), 1)
INSERT [dbo].[User] ([Id], [username], [email], [password], [img], [isActive], [phone], [address], [createdAt], [role_id]) VALUES (1002, N'Fasih Kazmi', N'fasih.kazmi@matcofoods.com', N'$2b$10$siFrzIle..OUIXGr4LL6ZexHPuUe.BhaDm9xdHfpzWcZmLmq9Ws1q', N'', 1, N'', N'Matco Foods Company....', CAST(0x0000B2A000EE9BBE AS DateTime), 2)
INSERT [dbo].[User] ([Id], [username], [email], [password], [img], [isActive], [phone], [address], [createdAt], [role_id]) VALUES (1003, N'Ali', N'hussain.ali.ned@gmail.com', N'$2b$10$alrxoFt6LdhctAqm.nxUvOX/vGmR0zI8KXonYt8pWv.EvUHhkWzKe', N'', 1, N'03217256715', N'H-B 18/8 F.C AREA LIAQUTABAD KARACHI', CAST(0x0000B2A300E4A222 AS DateTime), 3)
INSERT [dbo].[User] ([Id], [username], [email], [password], [img], [isActive], [phone], [address], [createdAt], [role_id]) VALUES (1008, N'test', N'muhammadmunirhussain1981@gmail.com', N'$2b$10$Ry2ul12.4y9syDa/isXtzu/pAJrLjtFKw0n5U0KyiE0B/VCpaIHYW', N'', 0, N'03222563582', N'house no c-68 moosa colony f.b area karachi', CAST(0x0000B2C001078DFB AS DateTime), 1)
SET IDENTITY_INSERT [dbo].[User] OFF
/****** Object:  StoredProcedure [dbo].[GetOEE]    Script Date: 04/22/2025 17:15:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--exec GetOEE 'mrp' ,'MATCO02','12-12-2022' ,'4-4-2025'

CREATE Procedure [dbo].[GetOEE](
@dataareaid nvarchar(10),
@site nvarchar(20) =null,
@start Date ,
@end Date
)

as 

begin


DECLARE @sites TABLE (SiteName NVARCHAR(50));

DECLARE @startDate Date = DATEADD(DAY, 1, CONVERT(Date, @start, 23))
DECLARE @endDate Date = DATEADD(DAY, 1, CONVERT(Date, @end, 23))



if(@dataareaid='mrp' and  @site is null)
begin

INSERT INTO @sites VALUES 
    ('GODOWNS'), ('MATCO02'),('MATCO08'), ('RIVIANA');

end

else if (@dataareaid<>'mrp' and @site is null)
begin


INSERT INTO @sites 
select NAME from [MATCOAX].[dbo].INVENTSITE where  DATAAREAID= @dataareaid

end
else
begin
INSERT INTO @sites VALUES (@site)
end



--Input 


SELECT 
    --pj.ProdShift,
    pj.PRODID,
   case when pjb.bomunitid ='Ton' then
((pjb.bomconsump)  *1000  )
--(select uc.factor from unitconvert uc where  uc.FromUnit = pjb.bomunitid and uc.ToUnit ='Ton' and uc.dataareaid=pjb.dataareaid)) 
else
	pjb.bomconsump end as bomconsump,
'Kg' as bomunitid,

     
                        
    
    CASE 
        WHEN pj.ProdShift = 1 THEN 'ShiftA'
        WHEN pj.ProdShift = 2 THEN 'ShiftB'
        WHEN pj.ProdShift = 3 THEN 'ShiftC'
        ELSE 'OtherShift'
    END AS ShiftName,
    
    -- Standard hours per shift
    CASE 
        WHEN pj.ProdShift = 1 THEN 7
        WHEN pj.ProdShift = 2 THEN 6
        WHEN pj.ProdShift = 3 THEN 11
        ELSE 0
    END AS StandardHours    -- Standard hours per shift type
  
   ,pj.DownHours
   , CASE 
        WHEN pj.ProdShift = 1 THEN 7-pj.DownHours
        WHEN pj.ProdShift = 2 THEN 6-pj.DownHours
        WHEN pj.ProdShift = 3 THEN 11-pj.DownHours
        ELSE 0
    END AS RuningHours 
    
    INTO #TempTable1
    
FROM  
    [MATCOAX].[dbo].ProdJournalTable pj 
  
    inner join [MATCOAX].[dbo].prodjournalbom pjb on
    
    pj.PRODID = pjb.PRODID AND pj.dataareaid = pjb.dataareaid 
    and  pj.journalid = pjb.journalid
    inner join [MATCOAX].[dbo].inventtable  on pjb.itemid  = INVENTTABLE.itemid and pjb.dataareaid = INVENTTABLE.dataareaid 
    

    
INNER JOIN [MATCOAX].[dbo].INVENTDIM ON PJB.INVENTDIMID=INVENTDIM.INVENTDIMID AND PJB.DATAAREAID=INVENTDIM.DATAAREAID
INNER JOIN [MATCOAX].[dbo].INVENTTABLEMODULE AS ivt ON pjb.ITEMID = ivt.ITEMID AND pj.DATAAREAID = ivt.DATAAREAID AND ivt.MODULETYPE = 0
and pjb.BOMUnitId not in('pcs')                     
and [MATCOAX].[dbo].INVENTTABLE.itemgroupid in ('0111','0101','0103','0201','0202','0204','0102','0104','0107','0108','0109','0403','0203','0703','0105','0401','0402','0405','0106','0409','0406','1202','1201','0408','0112','1401')
and  pjb.BOMCONSUMP > 0  
and left(INVENTTABLE.itemgroupid,2)!='03' --- not bag include
WHERE 
    pj.dataareaid = @dataareaid
   -- AND JOURNALNAMEID = 'PICK'  
   -- AND JOURNALTYPE = 0
     --and p.SchedEnd between '1-3-2025'  and '4-4-2025' 
    and pjb.TransDate between @startDate  and @endDate
    and left( pjb.prodid,3) ='PRO'
    AND pj.ProdShift != 0 --and pjb.prodid ='PKG-00071817' --'PRO-00073878'
  -- and (pj.POSTED = 1) 
   --and INVENTDIM.InventSiteId='MATCO02'
    and INVENTDIM.InventSiteId in (SELECT SiteName FROM @sites)


 --Out By Product  
   
   
   
   SELECT   

pjt.prodid ,
   CASE 
        WHEN pjt.ProdShift = 1 THEN 'ShiftA'
        WHEN pjt.ProdShift = 2 THEN 'ShiftB'
        WHEN pjt.ProdShift = 3 THEN 'ShiftC'
        ELSE 'OtherShift'
    END AS ShiftName, CASE WHEN pjb.bomunitid = 'Ton' THEN (- 1) * ((pjb.bomconsump) * 1000)
                        ELSE (- 1) * pjb.bomconsump END AS bomconsump, 
                      pjb.BOMUNITID, - 1 * pjb.CATCHWEIGHTQTY AS CatchWeightQty, pjb.CATCHWEIGHTUNIT, ISNULL
                          ((SELECT     SortID
                              FROM         MATCODashboards.dbo.VarietyListForRecovery AS VLR
                              WHERE     (Varietyid = ivt.ITEMVARIETYID)), 99) AS SortID
            INTO #TEMP_BYPRODUCT1
FROM                  [MATCOAX].[dbo].PRODJOURNALBOM AS pjb INNER JOIN
                      [MATCOAX].[dbo].PRODJOURNALTABLE AS pjt ON pjb.JOURNALID = pjt.JOURNALID AND pjb.DATAAREAID = pjt.DATAAREAID INNER JOIN
                      [MATCOAX].[dbo].INVENTTABLE AS ivt ON pjb.ITEMID = ivt.ITEMID AND pjb.DATAAREAID = ivt.DATAAREAID
                      INNER JOIN [MATCOAX].[dbo].INVENTDIM ON PJB.INVENTDIMID=INVENTDIM.INVENTDIMID AND PJB.DATAAREAID=INVENTDIM.DATAAREAID
Where pjb.dataareaid=@dataareaid
--and pjb.prodid = 'PRO-00073863'
--WHERE (pjb.DATAAREAID = 'mrp') 
--AND (pjb.PRODID = 'PRO-00034946') 
AND (ivt.ITEMGROUPID IN ('0201', '0102', '0202', '0203', '0204', '0104', '0106', '1209', '1210','1208','0103','0109','1403','1404','1404','1405','1406')) AND 
(pjt.POSTED = 1) AND (pjb.BOMCONSUMP < 0)
 and left( pjb.prodid,3) ='PRO' --- only PRO not PKG
 and left(ivt.ITEMGROUPID ,2)!='03' --Bag not include
                      


   
     and pjb.TransDate between @startDate  and @endDate
     AND pjt.ProdShift != 0 --and pjb.prodid ='PKG-00071817' --'PRO-00073878'

   --and INVENTDIM.InventSiteId='MATCO02'
    and INVENTDIM.InventSiteId in (SELECT SiteName FROM @sites)
   
   
   
   
   
   
   
   
   
   
   -- OutPut
   SELECT 

pjp.prodid ,

 CASE WHEN ivt.UNITID = 'Ton' THEN ((pjp.qtygood) /
                          (SELECT     uc.factor
                            FROM          [MATCOAX].[dbo].unitconvert uc
                            WHERE      uc.FromUnit = IVT.UNITID AND uc.ToUnit = 'Kg' AND uc.dataareaid = ivt.dataareaid)) ELSE pjp.qtygood END AS qtygood, 
                      CASE WHEN IVT.UNITID = 'Ton' THEN ((pjp.qtyerror) /
                          (SELECT     uc.factor
                            FROM          [MATCOAX].[dbo].unitconvert uc
                            WHERE      uc.FromUnit = IVT.UNITID AND uc.ToUnit = 'Kg' AND uc.dataareaid = ivt.dataareaid)) ELSE pjp.qtyerror END AS qtyerror
                            ,
                   
                        
    
    CASE 
        WHEN pjt.ProdShift = 1 THEN 'ShiftA'
        WHEN pjt.ProdShift = 2 THEN 'ShiftB'
        WHEN pjt.ProdShift = 3 THEN 'ShiftC'
        ELSE 'OtherShift'
    END AS ShiftName
    
  
    
    INTO #TempTable2
    
FROM         [MATCOAX].[dbo].PRODJOURNALPROD AS pjp INNER JOIN
                      [MATCOAX].[dbo].PRODJOURNALTABLE AS pjt ON pjp.JOURNALID = pjt.JOURNALID AND pjp.DATAAREAID = pjt.DATAAREAID INNER JOIN
                      [MATCOAX].[dbo].PRODTABLE AS pt ON pjp.PRODID = pt.PRODID AND pjp.DATAAREAID = pt.DATAAREAID INNER JOIN
                      [MATCOAX].[dbo].INVENTTABLEMODULE AS ivt ON pt.ITEMID = ivt.ITEMID AND pt.DATAAREAID = ivt.DATAAREAID AND ivt.MODULETYPE = 0 INNER JOIN
                      [MATCOAX].[dbo].INVENTTABLE ON pt.ITEMID = INVENTTABLE.ITEMID AND pt.DATAAREAID = INVENTTABLE.DATAAREAID INNER JOIN
                      [MATCOAX].[dbo].INVENTDIM ON pjp.INVENTDIMID = INVENTDIM.INVENTDIMID AND pjp.DATAAREAID = INVENTDIM.DATAAREAID

WHERE 
       pjp.dataareaid = @dataareaid
  
    and pjp.TransDate between @startDate  and @endDate 
    and left( pjp.prodid,3) ='PRO'
    AND pjt.ProdShift != 0 -- pjp.prodid ='PKG-00071817' --'PRO-00073878'
    and (pjt.POSTED = 1) 
   -- and INVENTDIM.InventSiteId='MATCO02'
 and INVENTDIM.InventSiteId in ((SELECT SiteName FROM @sites) )
 
 --Input
 
 SELECT 
    
    PRODID,
    ShiftName,SUM(bomconsump) AS CONSUMPQTY,
    --(SUM(RuningHours) / SUM(StandardHours) )*100 as PlantAvailability,
    SUM(isnull(RuningHours,0)) as RuningHours , SUM(isnull(StandardHours,0)) as StandardHours,
    --(SUM(RuningHours) / SUM(StandardHours) )as PlantAvil,
     --SUM(RuningHours) as TotalHours,count(ShiftName) as TotalCounts  
     bomunitid
   --  sum(qtygood) as QtyGood,
--sum(qtyerror) as qtyerror,bomunitid  ,(sum(qtygood)/SUM(bomconsump))*100   as PlantPerformance, 1*100 as Quality,

--(SUM(RuningHours) / SUM(StandardHours) )*(sum(qtygood)/SUM(bomconsump)) *1 *100  as OEE  -- PlantAvailability*PlantPerformance*Quality
INTO #TempTable3
FROM 
    #TempTable1
GROUP BY
 
    ShiftName ,bomunitid,PRODID
    
    
    
    --By Product
    
    SELECT prodid,SUM(bomconsump) AS ByProduct,ShiftName  

 INTO #TEMP_BYPRODUCT2

FROM #TEMP_BYPRODUCT1 GROUP BY 
BOMUNITID,ShiftName,prodid

    
    --Output
    
    SELECT 
   PRODID,
    ShiftName,
   sum(qtygood) as QtyGood,
   sum(qtyerror) as qtyerror
   --  sum(qtygood) as QtyGood,
--sum(qtyerror) as qtyerror,bomunitid  ,(sum(qtygood)/SUM(bomconsump))*100   as PlantPerformance, 1*100 as Quality,

--(SUM(RuningHours) / SUM(StandardHours) )*(sum(qtygood)/SUM(bomconsump)) *1 *100  as OEE  -- PlantAvailability*PlantPerformance*Quality


    INTO #TempTable4
FROM 
    #TempTable2
GROUP BY
 
    ShiftName ,prodid
 
 
   
    
    
    select -- #TempTable3.PRODID ,
    
   
    #TempTable3.ShiftName ,sum(#TEMP_BYPRODUCT2.ByProduct) as ByProduct
    ,sum(#TempTable3.CONSUMPQTY) AS ConsumQty,sum(#TempTable4.qtygood) as  QtyGood
    ,   
    (SUM(ISNULL(CAST(#TempTable3.RuningHours AS decimal(10,3)), 0)) / SUM(NULLIF(CAST(#TempTable3.StandardHours AS decimal(10,3)), 0))) * 100 AS PlantAvailability,

    (sum(#TempTable4.qtygood)/sum(#TempTable3.CONSUMPQTY))*100   as PlantPerformance, 1*100 as Quality, 
    ((SUM(ISNULL(CAST(#TempTable3.RuningHours AS decimal(10,3)), 0)) / SUM(NULLIF(CAST(#TempTable3.StandardHours AS decimal(10,3)), 0))) )*(sum(#TempTable4.qtygood)/sum(#TempTable3.CONSUMPQTY)) *1 *100  as OEE
    
     into #TEMP_All_Tables
     
     from  
     
     
     #TempTable3 inner join #TempTable4
    on #TempTable3.shiftName=#TempTable4.shiftName 
    and #TempTable3.PRODID=#TempTable4.PRODID 
    inner join #TEMP_BYPRODUCT2 on #TEMP_BYPRODUCT2.shiftName=#TEMP_BYPRODUCT2.shiftName 
    and  #TEMP_BYPRODUCT2.PRODID=#TEMP_BYPRODUCT2.PRODID 
    
    group by #TempTable3.ShiftName -- ,#TempTable3.PRODID
    order by #TempTable3.ShiftName
    
    
    
    select * from #TEMP_All_Tables
    
    select sum(#TEMP_All_Tables.PlantAvailability)/count(*) as PlantAvailability  ,
    sum(#TEMP_All_Tables.PlantPerformance)/count(*)  as PlantPerformance,sum(#TEMP_All_Tables.Quality)/count(*) as Quality, 
    sum(#TEMP_All_Tables.OEE)/count(*)  as OEE , 'AllShifts' as 'AllShifts'
    
    from #TEMP_All_Tables
    
    
    
     DROP TABLE #TempTable1
     DROP TABLE #TempTable2
     DROP TABLE #TempTable3
     DROP TABLE #TempTable4
     DROP TABLE #TEMP_BYPRODUCT1
     DROP TABLE #TEMP_BYPRODUCT2
     Drop Table #TEMP_All_Tables
     end
GO
/****** Object:  StoredProcedure [dbo].[GetMenusByRole]    Script Date: 04/22/2025 17:15:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[GetMenusByRole]
(@id int)
as
SELECT Menus.title, Menus.url , Menus.category
                FROM Menus 
                JOIN Roles ON Menus.role_id = Roles.id 
                WHERE Roles.id = @id
GO
/****** Object:  Table [dbo].[UserSiteAccess]    Script Date: 04/22/2025 17:15:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserSiteAccess](
	[AccessID] [int] IDENTITY(1,1) NOT NULL,
	[UserID] [int] NOT NULL,
	[SiteID] [int] NOT NULL,
	[IsActive] [bit] NULL,
	[GrantedDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[AccessID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY],
 CONSTRAINT [UQ_UserSite] UNIQUE NONCLUSTERED 
(
	[UserID] ASC,
	[SiteID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[UserSiteAccess] ON
INSERT [dbo].[UserSiteAccess] ([AccessID], [UserID], [SiteID], [IsActive], [GrantedDate]) VALUES (1, 15, 3, 1, CAST(0x0000B2B700F6DAF9 AS DateTime))
INSERT [dbo].[UserSiteAccess] ([AccessID], [UserID], [SiteID], [IsActive], [GrantedDate]) VALUES (2, 15, 4, 1, CAST(0x0000B2B700F6DAF9 AS DateTime))
INSERT [dbo].[UserSiteAccess] ([AccessID], [UserID], [SiteID], [IsActive], [GrantedDate]) VALUES (3, 15, 1, 1, CAST(0x0000B2B700F6DAF9 AS DateTime))
INSERT [dbo].[UserSiteAccess] ([AccessID], [UserID], [SiteID], [IsActive], [GrantedDate]) VALUES (4, 15, 2, 1, CAST(0x0000B2B700F6DAF9 AS DateTime))
INSERT [dbo].[UserSiteAccess] ([AccessID], [UserID], [SiteID], [IsActive], [GrantedDate]) VALUES (5, 1002, 1, 1, CAST(0x0000B2B700F777A7 AS DateTime))
INSERT [dbo].[UserSiteAccess] ([AccessID], [UserID], [SiteID], [IsActive], [GrantedDate]) VALUES (6, 1003, 3, 1, CAST(0x0000B2B700F7A90B AS DateTime))
INSERT [dbo].[UserSiteAccess] ([AccessID], [UserID], [SiteID], [IsActive], [GrantedDate]) VALUES (7, 1003, 4, 1, CAST(0x0000B2B700F7A90B AS DateTime))
INSERT [dbo].[UserSiteAccess] ([AccessID], [UserID], [SiteID], [IsActive], [GrantedDate]) VALUES (8, 1003, 1, 1, CAST(0x0000B2B700F7A90B AS DateTime))
INSERT [dbo].[UserSiteAccess] ([AccessID], [UserID], [SiteID], [IsActive], [GrantedDate]) VALUES (9, 1003, 2, 1, CAST(0x0000B2B700F7A90B AS DateTime))
INSERT [dbo].[UserSiteAccess] ([AccessID], [UserID], [SiteID], [IsActive], [GrantedDate]) VALUES (43, 1008, 3, 1, CAST(0x0000B2C601192BBB AS DateTime))
INSERT [dbo].[UserSiteAccess] ([AccessID], [UserID], [SiteID], [IsActive], [GrantedDate]) VALUES (44, 1008, 4, 1, CAST(0x0000B2C601192BBB AS DateTime))
INSERT [dbo].[UserSiteAccess] ([AccessID], [UserID], [SiteID], [IsActive], [GrantedDate]) VALUES (45, 1008, 1, 1, CAST(0x0000B2C601192BBB AS DateTime))
INSERT [dbo].[UserSiteAccess] ([AccessID], [UserID], [SiteID], [IsActive], [GrantedDate]) VALUES (46, 1008, 2, 1, CAST(0x0000B2C601192BBB AS DateTime))
SET IDENTITY_INSERT [dbo].[UserSiteAccess] OFF
/****** Object:  StoredProcedure [dbo].[UserfindById]    Script Date: 04/22/2025 17:15:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
Create PROCEDURE [dbo].[UserfindById]
(@id int)
AS

BEGIN
    IF NOT EXISTS (SELECT * FROM [User]  WHERE id =@id )
BEGIN
    Select 'User not founds'
END
ELSE
   BEGIN
     
	 select * from [User] where Id=@id

	

   END
END
GO
/****** Object:  StoredProcedure [dbo].[UpdateUserPassword]    Script Date: 04/22/2025 17:15:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE  PROCEDURE [dbo].[UpdateUserPassword]
(@userId int,@password nvarchar(max))
AS

BEGIN
    IF NOT EXISTS (SELECT * FROM [User]  WHERE id =@userId )
BEGIN
    Select 'User not founds'
END
ELSE
   BEGIN
     
	UPDATE [User] SET [password] = @password WHERE id = @userId

	
   END
END
GO
/****** Object:  StoredProcedure [dbo].[findUserByIdAndUpdate]    Script Date: 04/22/2025 17:15:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[findUserByIdAndUpdate]
(
@id int,
@username nvarchar(50),
@email nvarchar(50),
@password nvarchar(max),
@img nvarchar(max)='',
--@isAdmin bit,
@isActive bit,
@phone nvarchar(50),
@address nvarchar(max),
@role_id int,
@site_Ids nvarchar(50)


)
AS

BEGIN
    IF NOT EXISTS (SELECT * FROM [User]  WHERE Id =@id )
BEGIN
    Select 'User does not exists'
END
ELSE
   BEGIN

   update  [User]   set username=ISNULL(@username,username) ,email=ISNULL(@email,email),
          [password]=ISNULL(@password,[password]),img=ISNULL(@img,img)
          ,role_id=@role_id
          --,isAdmin=ISNULL(@isAdmin,isAdmin) 
		  ,isActive=ISNULL(@isActive,isActive),phone=ISNULL(@phone,phone),
          [address]=ISNULL(@address,[address])
		  where Id=@id
		  
	
	delete from [UserSiteAccess]
	where  	  UserID=@id
		  
 insert into [UserSiteAccess]([UserID],[SiteID],[IsActive])
 
select @id,[SiteID],1 from (
select [Param] from  dbo.fun_splitstring(@site_Ids) ) as tb
inner join [Sites] on LTRIM(RTRIM([Param]))=LTRIM(RTRIM(SiteCode))
 

	  Select 'Update successfully'

   END
END
GO
/****** Object:  StoredProcedure [dbo].[findUserByEmail]    Script Date: 04/22/2025 17:15:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[findUserByEmail]
(@email nvarchar(50))
AS

BEGIN
    IF NOT EXISTS (SELECT * FROM [User]  WHERE email =@email )
BEGIN
    Select 'User not founds'
END
ELSE
   BEGIN
     
	 select Id,username,email,isActive,[password],role_id 
	 ,
	  siteID=(SELECT 
   top 1   s.[SiteCode]
  FROM [AdminDashboard].[dbo].[UserSiteAccess]   usa
  inner join [AdminDashboard].[dbo].Sites    s
  on s.SiteID=usa.SiteID
  and usa.UserID=Id
  
  order by s.[SiteID])
	 
	 from [User]
	
	 where email=@email

	

   END
END
GO
/****** Object:  StoredProcedure [dbo].[deleteUser]    Script Date: 04/22/2025 17:15:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[deleteUser]
(@id int)
AS

BEGIN
    IF NOT EXISTS (SELECT * FROM [User]  WHERE id =@id )
BEGIN
    Select 'User not founds'
END
ELSE
   BEGIN
     
	 delete from [User] where Id=@id
	 delete from  [UserSiteAccess]  where [UserID]= @id

	  Select 'User has been deleted' 

   END
END
GO
/****** Object:  StoredProcedure [dbo].[InsertUser]    Script Date: 04/22/2025 17:15:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[InsertUser]
(@username nvarchar(50),
@email nvarchar(50),
@password nvarchar(max),
@img nvarchar(max)='',
--@isAdmin bit,
@isActive bit,
@phone nvarchar(50),
@address nvarchar(max),
@role_id int,
@site_Ids nvarchar(50)


)
AS

BEGIN
    IF EXISTS (SELECT * FROM [User]  WHERE email =@email  )
BEGIN
    Select 'Email Exists'
END
ELSE
   BEGIN
      insert into [User](username,email,[password],img,isActive,phone,[address],role_id) 
	  values(@username,@email,@password,@img,@isActive,@phone,@address,@role_id )

-- Capture first identity
DECLARE @UserID int = SCOPE_IDENTITY();

 insert into [UserSiteAccess]([UserID],[SiteID],[IsActive])
 
 --select @UserID,(select SiteID  from [Sites] where SiteCode= [Param] ), 1 from dbo.fun_splitstring(@site_Ids)
 
 
select @UserID,[SiteID],1 from (
select [Param] from  dbo.fun_splitstring(@site_Ids) ) as tb
inner join [Sites] on LTRIM(RTRIM([Param]))=LTRIM(RTRIM(SiteCode))
 


	  Select 'New user has been created'

   END
END
GO
/****** Object:  StoredProcedure [dbo].[GetSitesByUserId]    Script Date: 04/22/2025 17:15:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE  procedure [dbo].[GetSitesByUserId]
(@UserId int)
as
SELECT s.SiteCode  as Id ,s.IsActive 
FROM Sites s inner
JOIN UserSiteAccess usa ON s.SiteID = usa.SiteID
--and s.IsActive=1

WHERE usa.UserID = @UserId  -- UserID for manager1
order by s.SiteID

--exec [GetSitesByUserId] 15
GO
/****** Object:  Default [DF__Sites__IsActive__4CA06362]    Script Date: 04/22/2025 17:15:13 ******/
ALTER TABLE [dbo].[Sites] ADD  DEFAULT ((1)) FOR [IsActive]
GO
/****** Object:  Default [DF__Sites__CreatedDa__4D94879B]    Script Date: 04/22/2025 17:15:13 ******/
ALTER TABLE [dbo].[Sites] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
/****** Object:  Default [DF_User_isActive]    Script Date: 04/22/2025 17:15:13 ******/
ALTER TABLE [dbo].[User] ADD  CONSTRAINT [DF_User_isActive]  DEFAULT ((0)) FOR [isActive]
GO
/****** Object:  Default [DF_User_timestamps]    Script Date: 04/22/2025 17:15:13 ******/
ALTER TABLE [dbo].[User] ADD  CONSTRAINT [DF_User_timestamps]  DEFAULT (getdate()) FOR [createdAt]
GO
/****** Object:  Default [DF__UserSiteA__IsAct__534D60F1]    Script Date: 04/22/2025 17:15:13 ******/
ALTER TABLE [dbo].[UserSiteAccess] ADD  DEFAULT ((1)) FOR [IsActive]
GO
/****** Object:  Default [DF__UserSiteA__Grant__5441852A]    Script Date: 04/22/2025 17:15:13 ******/
ALTER TABLE [dbo].[UserSiteAccess] ADD  DEFAULT (getdate()) FOR [GrantedDate]
GO
/****** Object:  ForeignKey [FK__Menus__role_id__22AA2996]    Script Date: 04/22/2025 17:15:13 ******/
ALTER TABLE [dbo].[Menus]  WITH CHECK ADD FOREIGN KEY([role_id])
REFERENCES [dbo].[Roles] ([id])
GO
/****** Object:  ForeignKey [FK__User__role_id__239E4DCF]    Script Date: 04/22/2025 17:15:13 ******/
ALTER TABLE [dbo].[User]  WITH CHECK ADD FOREIGN KEY([role_id])
REFERENCES [dbo].[Roles] ([id])
GO
/****** Object:  ForeignKey [FK_UserSiteAccess_Site]    Script Date: 04/22/2025 17:15:13 ******/
ALTER TABLE [dbo].[UserSiteAccess]  WITH CHECK ADD  CONSTRAINT [FK_UserSiteAccess_Site] FOREIGN KEY([SiteID])
REFERENCES [dbo].[Sites] ([SiteID])
GO
ALTER TABLE [dbo].[UserSiteAccess] CHECK CONSTRAINT [FK_UserSiteAccess_Site]
GO
/****** Object:  ForeignKey [FK_UserSiteAccess_User]    Script Date: 04/22/2025 17:15:13 ******/
ALTER TABLE [dbo].[UserSiteAccess]  WITH CHECK ADD  CONSTRAINT [FK_UserSiteAccess_User] FOREIGN KEY([UserID])
REFERENCES [dbo].[User] ([Id])
GO
ALTER TABLE [dbo].[UserSiteAccess] CHECK CONSTRAINT [FK_UserSiteAccess_User]
GO
