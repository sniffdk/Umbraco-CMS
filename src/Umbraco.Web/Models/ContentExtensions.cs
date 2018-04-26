﻿using System;
using System.Globalization;
using System.Linq;
using Umbraco.Core.Models;
using Umbraco.Core.Services;
using Umbraco.Web.Composing;
using Umbraco.Web.Routing;
using Domain = Umbraco.Web.Routing.Domain;

namespace Umbraco.Web.Models
{
    public static class ContentExtensions
    {
        //TODO: Not used
        ///// <summary>
        ///// Gets the culture that would be selected to render a specified content,
        ///// within the context of a specified current request.
        ///// </summary>
        ///// <param name="content">The content.</param>
        ///// <param name="current">The request Uri.</param>
        ///// <returns>The culture that would be selected to render the content.</returns>
        //public static CultureInfo GetCulture(this IContent content, Uri current = null)
        //{
        //    return GetCulture(UmbracoContext.Current,
        //        Current.Services.DomainService,
        //        Current.Services.LocalizationService,
        //        Current.Services.ContentService,
        //        content.Id, content.Path,
        //        current);
        //}



        //TODO: Not used - only in tests
        /// <summary>
        /// Gets the culture that would be selected to render a specified content,
        /// within the context of a specified current request.
        /// </summary>
        /// <param name="umbracoContext">An <see cref="UmbracoContext"/> instance.</param>
        /// <param name="domainService">An <see cref="IDomainService"/> implementation.</param>
        /// <param name="localizationService">An <see cref="ILocalizationService"/> implementation.</param>
        /// <param name="contentService">An <see cref="IContentService"/> implementation.</param>
        /// <param name="contentId">The content identifier.</param>
        /// <param name="contentPath">The content path.</param>
        /// <param name="current">The request Uri.</param>
        /// <returns>The culture that would be selected to render the content.</returns>
        internal static CultureInfo GetCulture(UmbracoContext umbracoContext,
            IDomainService domainService, ILocalizationService localizationService, IContentService contentService,
            ISiteDomainHelper siteDomainHelper,
            int contentId, string contentPath, Uri current)
        {
            var route = umbracoContext == null
                ? null // for tests only
                : umbracoContext.ContentCache.GetRouteById(contentId); // may be cached

            var domainCache = umbracoContext == null
                ? new PublishedCache.XmlPublishedCache.DomainCache(domainService, localizationService) // for tests only
                : umbracoContext.PublishedShapshot.Domains; // default
            var domainHelper = umbracoContext.GetDomainHelper(siteDomainHelper);
            Domain domain;

            if (route == null)
            {
                // if content is not published then route is null and we have to work
                // on non-published content (note: could optimize by checking routes?)

                // fixme - even non-published content is stored in the cache or in the cmsContentNu table which would be faster to lookup

                var content = contentService.GetById(contentId);
                if (content == null)
                    return GetDefaultCulture(localizationService);

                var hasDomain = domainHelper.NodeHasDomains(content.Id);
                while (hasDomain == false && content != null)
                {
                    content = content.Parent(contentService);
                    hasDomain = content != null && domainHelper.NodeHasDomains(content.Id);
                }

                domain = hasDomain ? domainHelper.DomainForNode(content.Id, current) : null;
            }
            else
            {
                // if content is published then we have a route
                // from which we can figure out the domain

                var pos = route.IndexOf('/');
                domain = pos == 0
                    ? null
                    : domainHelper.DomainForNode(int.Parse(route.Substring(0, pos)), current);
            }

            var rootContentId = domain == null ? -1 : domain.ContentId;
            var wcDomain = DomainHelper.FindWildcardDomainInPath(domainCache.GetAll(true), contentPath, rootContentId);

            if (wcDomain != null) return wcDomain.Culture;
            if (domain != null) return domain.Culture;
            return GetDefaultCulture(localizationService);
        }

        private static CultureInfo GetDefaultCulture(ILocalizationService localizationService)
        {
            var defaultLanguage = localizationService.GetDefaultVariantLanguage();
            return defaultLanguage == null ? CultureInfo.CurrentUICulture : new CultureInfo(defaultLanguage.IsoCode);
        }
    }
}
