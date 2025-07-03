# Azure Group Matrix Access Control Plugin

A comprehensive Strapi plugin that implements Azure AD group-based access control with a 6×4 matrix structure for content management.

## 🎯 Overview

This plugin provides:
- **24 Azure Groups** organized in a 6×4 matrix (6 domains × 4 classification levels)  
- **Content-to-Group Assignment** with many-to-many relationships
- **User Access Control** based on Azure AD group membership
- **Visual Group Matrix** for easy management
- **RBAC Integration** with Strapi's permission system

## 📊 Matrix Structure

### Domains (6)
- **Economy** - Economic data and indicators
- **Population** - Demographic and census data  
- **Agriculture** - Agricultural statistics and reports
- **Industry** - Industrial production and metrics
- **Social** - Social services and welfare data
- **Labour Force** - Employment and workforce statistics

### Classifications (4)
- **Open** - Publicly accessible data
- **Confidential** - Internal use only
- **Sensitive** - Restricted access required
- **Secret** - Highly classified information

## 🚀 Installation & Usage

### Built Components:
✅ **Backend Services** - Azure integration, group management  
✅ **Content Type** - Azure groups with matrix structure  
✅ **API Controllers** - Full CRUD and access control  
✅ **Access Policies** - Group-based content filtering  
✅ **Visual Matrix** - 6×4 interactive group interface  
✅ **Group Selector** - Content assignment with validation  
✅ **Admin Dashboard** - Complete management interface  

### Quick Start:
1. Build: `npm run build`
2. Configure Azure AD in `.env`
3. Enable in `config/plugins.js`
4. Access at `/admin/plugins/group-matrix-access`

The complete solution provides enterprise-grade access control for ADDP content management.